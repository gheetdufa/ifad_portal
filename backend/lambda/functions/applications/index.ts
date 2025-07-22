import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const { response, db, auth, validate, transform } = require('/opt/nodejs/utils');

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.resource;
    const method = event.httpMethod;
    const pathParameters = event.pathParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};
    const queryStringParameters = event.queryStringParameters || {};

    console.log(`Processing ${method} ${path}`, { pathParameters, queryStringParameters });

    const currentUser = await auth.getUserFromToken(event);

    switch (true) {
      case path.includes('/applications') && method === 'POST':
        return await handleSubmitApplication(currentUser, body);
      
      case path.includes('/applications') && method === 'GET':
        return await handleGetApplications(currentUser, queryStringParameters);
      
      case path.includes('/applications/{applicationId}') && method === 'GET':
        return await handleGetApplication(currentUser, pathParameters.applicationId!);
      
      case path.includes('/applications/{applicationId}') && method === 'PUT':
        return await handleUpdateApplication(currentUser, pathParameters.applicationId!, body);
      
      case path.includes('/applications/{applicationId}/review') && method === 'POST':
        return await handleReviewApplication(currentUser, pathParameters.applicationId!, body);
      
      case path.includes('/applications/{applicationId}/match') && method === 'POST':
        return await handleMatchApplication(currentUser, pathParameters.applicationId!, body);
      
      default:
        return response.error('Not Found', 404);
    }
  } catch (error) {
    console.error('Applications handler error:', error);
    return response.error('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error');
  }
};

async function handleSubmitApplication(currentUser: any, body: any): Promise<APIGatewayProxyResult> {
  try {
    if (currentUser.role !== 'student') {
      return response.error('Only students can submit applications', 403);
    }

    const { rankedHostIds, semester, answers, preferences } = body;

    validate.required(rankedHostIds, 'Ranked host preferences');
    validate.required(semester, 'Semester');

    if (!Array.isArray(rankedHostIds) || rankedHostIds.length === 0) {
      return response.error('Must provide at least one host preference');
    }

    if (rankedHostIds.length > 5) {
      return response.error('Cannot rank more than 5 host preferences');
    }

    // Check if student already has an application for this semester
    const existingApplications = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :studentId',
      FilterExpression: 'semester = :semester',
      ExpressionAttributeValues: {
        ':studentId': `STUDENT#${currentUser.userId}`,
        ':semester': semester,
      },
    });

    if (existingApplications.length > 0) {
      return response.error('Application already exists for this semester', 409);
    }

    const applicationId = uuidv4();
    const application = {
      applicationId,
      studentId: currentUser.userId,
      rankedHostIds,
      semester,
      answers: answers || {},
      preferences: preferences || {},
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    const dynamoItem = transform.applicationToDynamoItem(application);
    
    await db.put({
      TableName: TABLE_NAME,
      Item: dynamoItem,
    });

    // Update student profile to mark application as submitted
    const studentProfile = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${currentUser.userId}`,
        SK: 'PROFILE',
      },
    });

    if (studentProfile) {
      await db.put({
        TableName: TABLE_NAME,
        Item: {
          ...studentProfile,
          applicationSubmitted: true,
          updatedAt: new Date().toISOString(),
        },
      });
    }

    return response.success({
      message: 'Application submitted successfully',
      applicationId,
    }, 201);
  } catch (error) {
    console.error('Submit application error:', error);
    return response.error('Failed to submit application', 500);
  }
}

async function handleGetApplications(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester, status, hostId, limit = '50' } = queryParams;

    let queryExpression: string;
    let expressionAttributeValues: any = {};
    let indexName: string;

    if (currentUser.role === 'student') {
      // Students can only see their own applications
      indexName = 'GSI1';
      queryExpression = 'GSI1PK = :studentId';
      expressionAttributeValues[':studentId'] = `STUDENT#${currentUser.userId}`;
    } else if (currentUser.role === 'host') {
      // Hosts see applications that include them in rankings
      return await handleGetApplicationsForHost(currentUser, queryParams);
    } else if (currentUser.role === 'admin') {
      // Admins see all applications, optionally filtered by semester
      if (semester) {
        indexName = 'GSI2';
        queryExpression = 'GSI2PK = :semester';
        expressionAttributeValues[':semester'] = `SEMESTER#${semester}`;
      } else {
        return await handleGetAllApplications(currentUser, queryParams);
      }
    } else {
      return response.error('Not authorized to view applications', 403);
    }

    const params: any = {
      TableName: TABLE_NAME,
      IndexName: indexName,
      KeyConditionExpression: queryExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: parseInt(limit),
    };

    // Add status filter if specified
    if (status) {
      params.FilterExpression = '#status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues[':status'] = status;
    }

    const applications = await db.query(params);

    return response.success({
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return response.error('Failed to retrieve applications', 500);
  }
}

async function handleGetApplicationsForHost(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester, status, limit = '50' } = queryParams;

    // For hosts, we need to scan and filter applications that include this host
    // This is not optimal for large datasets - in production you might want to maintain
    // a separate index or denormalized data
    const params: any = {
      TableName: TABLE_NAME,
      FilterExpression: 'contains(rankedHostIds, :hostId)',
      ExpressionAttributeValues: {
        ':hostId': currentUser.userId,
      },
      Limit: parseInt(limit),
    };

    if (semester) {
      params.FilterExpression += ' AND semester = :semester';
      params.ExpressionAttributeValues[':semester'] = semester;
    }

    if (status) {
      params.FilterExpression += ' AND #status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues[':status'] = status;
    }

    // Note: This uses scan which is expensive - consider optimizing for production
    const applications = await db.query(params);

    return response.success({
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('Get applications for host error:', error);
    return response.error('Failed to retrieve applications', 500);
  }
}

async function handleGetAllApplications(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    if (currentUser.role !== 'admin') {
      return response.error('Not authorized to view all applications', 403);
    }

    const { status, limit = '100' } = queryParams;

    const params: any = {
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(PK, :applicationPrefix)',
      ExpressionAttributeValues: {
        ':applicationPrefix': 'APPLICATION#',
      },
      Limit: parseInt(limit),
    };

    if (status) {
      params.FilterExpression += ' AND #status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues[':status'] = status;
    }

    const applications = await db.query(params);

    return response.success({
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    return response.error('Failed to retrieve applications', 500);
  }
}

async function handleGetApplication(currentUser: any, applicationId: string): Promise<APIGatewayProxyResult> {
  try {
    const application = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `APPLICATION#${applicationId}`,
        SK: 'METADATA',
      },
    });

    if (!application) {
      return response.error('Application not found', 404);
    }

    // Authorization check
    const isOwner = currentUser.userId === application.studentId;
    const isRelevantHost = currentUser.role === 'host' && application.rankedHostIds.includes(currentUser.userId);
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isRelevantHost && !isAdmin) {
      return response.error('Not authorized to view this application', 403);
    }

    return response.success(application);
  } catch (error) {
    console.error('Get application error:', error);
    return response.error('Failed to retrieve application', 500);
  }
}

async function handleUpdateApplication(currentUser: any, applicationId: string, body: any): Promise<APIGatewayProxyResult> {
  try {
    const application = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `APPLICATION#${applicationId}`,
        SK: 'METADATA',
      },
    });

    if (!application) {
      return response.error('Application not found', 404);
    }

    // Only students can update their own applications, and only if not yet matched
    if (currentUser.role !== 'student' || currentUser.userId !== application.studentId) {
      return response.error('Not authorized to update this application', 403);
    }

    if (application.status === 'matched' || application.status === 'completed') {
      return response.error('Cannot update application that is already matched or completed', 400);
    }

    const { applicationId: _, studentId: __, ...updateData } = body;

    const updatedApplication = {
      ...application,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await db.put({
      TableName: TABLE_NAME,
      Item: updatedApplication,
    });

    return response.success(updatedApplication);
  } catch (error) {
    console.error('Update application error:', error);
    return response.error('Failed to update application', 500);
  }
}

async function handleReviewApplication(currentUser: any, applicationId: string, body: any): Promise<APIGatewayProxyResult> {
  try {
    if (!auth.requireRole(currentUser.role, ['host', 'admin'])) {
      return response.error('Not authorized to review applications', 403);
    }

    const application = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `APPLICATION#${applicationId}`,
        SK: 'METADATA',
      },
    });

    if (!application) {
      return response.error('Application not found', 404);
    }

    // Hosts can only review applications that include them
    if (currentUser.role === 'host' && !application.rankedHostIds.includes(currentUser.userId)) {
      return response.error('Not authorized to review this application', 403);
    }

    const { decision, notes, ranking } = body; // 'accept', 'reject', 'maybe'

    if (!['accept', 'reject', 'maybe'].includes(decision)) {
      return response.error('Invalid decision value', 400);
    }

    // Add review to application
    const reviewData = {
      hostId: currentUser.userId,
      decision,
      notes: notes || '',
      ranking: ranking || null,
      reviewedAt: new Date().toISOString(),
    };

    const updatedApplication = {
      ...application,
      reviews: {
        ...application.reviews,
        [currentUser.userId]: reviewData,
      },
      updatedAt: new Date().toISOString(),
    };

    await db.put({
      TableName: TABLE_NAME,
      Item: updatedApplication,
    });

    return response.success({
      message: 'Application reviewed successfully',
      review: reviewData,
    });
  } catch (error) {
    console.error('Review application error:', error);
    return response.error('Failed to review application', 500);
  }
}

async function handleMatchApplication(currentUser: any, applicationId: string, body: any): Promise<APIGatewayProxyResult> {
  try {
    if (currentUser.role !== 'admin') {
      return response.error('Only admins can create matches', 403);
    }

    const application = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `APPLICATION#${applicationId}`,
        SK: 'METADATA',
      },
    });

    if (!application) {
      return response.error('Application not found', 404);
    }

    const { hostId } = body;

    if (!hostId) {
      return response.error('Host ID is required for matching', 400);
    }

    // Verify the host exists and is in the application's ranked list
    if (!application.rankedHostIds.includes(hostId)) {
      return response.error('Host not in student\'s ranked preferences', 400);
    }

    // Create match record
    const matchId = uuidv4();
    const match = {
      PK: `MATCH#${matchId}`,
      SK: 'METADATA',
      GSI1PK: `STUDENT#${application.studentId}`,
      GSI1SK: `MATCH#${matchId}`,
      GSI2PK: `HOST#${hostId}`,
      GSI2SK: `MATCH#${matchId}`,
      matchId,
      applicationId,
      studentId: application.studentId,
      hostId,
      semester: application.semester,
      status: 'confirmed',
      matchedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.put({
      TableName: TABLE_NAME,
      Item: match,
    });

    // Update application status
    const updatedApplication = {
      ...application,
      status: 'matched',
      matchId,
      matchedHostId: hostId,
      matchedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.put({
      TableName: TABLE_NAME,
      Item: updatedApplication,
    });

    return response.success({
      message: 'Match created successfully',
      matchId,
      match,
    }, 201);
  } catch (error) {
    console.error('Match application error:', error);
    return response.error('Failed to create match', 500);
  }
}
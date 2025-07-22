import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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

    // Get user from token for all authenticated endpoints
    const currentUser = await auth.getUserFromToken(event);

    switch (true) {
      case path.includes('/users/profile') && method === 'GET':
        return await handleGetProfile(currentUser);
      
      case path.includes('/users/profile') && method === 'PUT':
        return await handleUpdateProfile(currentUser, body);
      
      case path.includes('/users/search') && method === 'GET':
        return await handleSearchUsers(currentUser, queryStringParameters);
      
      case path.includes('/users/{userId}') && method === 'GET':
        return await handleGetUserById(currentUser, pathParameters.userId!);
      
      case path.includes('/users/hosts') && method === 'GET':
        return await handleGetHosts(currentUser, queryStringParameters);
      
      default:
        return response.error('Not Found', 404);
    }
  } catch (error) {
    console.error('Users handler error:', error);
    return response.error('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error');
  }
};

async function handleGetProfile(currentUser: any): Promise<APIGatewayProxyResult> {
  try {
    const userProfile = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${currentUser.userId}`,
        SK: 'PROFILE',
      },
    });

    if (!userProfile) {
      return response.error('Profile not found', 404);
    }

    return response.success(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    return response.error('Failed to retrieve profile', 500);
  }
}

async function handleUpdateProfile(currentUser: any, body: any): Promise<APIGatewayProxyResult> {
  try {
    const { userId, email, role, createdAt, PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...updateData } = body;

    // Validate that user can only update their own profile (unless admin)
    if (currentUser.role !== 'admin' && currentUser.userId !== userId && currentUser.userId !== body.userId) {
      return response.error('Not authorized to update this profile', 403);
    }

    // Get current profile
    const currentProfile = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${currentUser.userId}`,
        SK: 'PROFILE',
      },
    });

    if (!currentProfile) {
      return response.error('Profile not found', 404);
    }

    // Update profile
    const updatedProfile = {
      ...currentProfile,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await db.put({
      TableName: TABLE_NAME,
      Item: updatedProfile,
    });

    return response.success(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    return response.error('Failed to update profile', 500);
  }
}

async function handleSearchUsers(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { role, limit = '50', lastEvaluatedKey } = queryParams;

    if (!auth.requireRole(currentUser.role, ['admin', 'host'])) {
      return response.error('Not authorized to search users', 403);
    }

    let queryExpression = 'GSI2PK = :role';
    const expressionAttributeValues: any = {};

    if (role && ['student', 'host', 'admin'].includes(role)) {
      expressionAttributeValues[':role'] = `ROLE#${role}`;
    } else {
      // Default to searching all users if no specific role
      return await handleGetAllUsers(currentUser, parseInt(limit), lastEvaluatedKey);
    }

    const params: any = {
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: queryExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: parseInt(limit),
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const users = await db.query(params);

    return response.success({
      users,
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Search users error:', error);
    return response.error('Failed to search users', 500);
  }
}

async function handleGetAllUsers(currentUser: any, limit: number, lastEvaluatedKey?: string): Promise<APIGatewayProxyResult> {
  try {
    if (!auth.requireRole(currentUser.role, 'admin')) {
      return response.error('Not authorized to view all users', 403);
    }

    // This is a simplified implementation - in practice, you might want pagination
    const users = await db.query({
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(PK, :userPrefix)',
      ExpressionAttributeValues: {
        ':userPrefix': 'USER#',
      },
      Limit: limit,
    });

    return response.success({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return response.error('Failed to retrieve users', 500);
  }
}

async function handleGetUserById(currentUser: any, userId: string): Promise<APIGatewayProxyResult> {
  try {
    // Users can view their own profile, admins can view any profile
    if (currentUser.userId !== userId && currentUser.role !== 'admin') {
      return response.error('Not authorized to view this profile', 403);
    }

    const userProfile = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
    });

    if (!userProfile) {
      return response.error('User not found', 404);
    }

    return response.success(userProfile);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return response.error('Failed to retrieve user', 500);
  }
}

async function handleGetHosts(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { limit = '50', industry, location, verified, lastEvaluatedKey } = queryParams;

    // Get all hosts
    let params: any = {
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :role',
      ExpressionAttributeValues: {
        ':role': 'ROLE#host',
      },
      Limit: parseInt(limit),
    };

    // Add filters if specified
    let filterExpressions = [];
    if (verified === 'true') {
      filterExpressions.push('verified = :verified');
      params.ExpressionAttributeValues[':verified'] = true;
    }

    if (industry) {
      filterExpressions.push('contains(industry, :industry)');
      params.ExpressionAttributeValues[':industry'] = industry;
    }

    if (location) {
      filterExpressions.push('contains(#location, :location)');
      params.ExpressionAttributeValues[':location'] = location;
      params.ExpressionAttributeNames = { '#location': 'location' };
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const hosts = await db.query(params);

    return response.success({
      hosts,
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Get hosts error:', error);
    return response.error('Failed to retrieve hosts', 500);
  }
}
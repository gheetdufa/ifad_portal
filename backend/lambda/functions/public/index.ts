import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const { response, db } = require('/opt/nodejs/utils');

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.resource;
    const method = event.httpMethod;
    const queryStringParameters = event.queryStringParameters || {};

    console.log(`Processing ${method} ${path}`, { queryStringParameters });

    switch (true) {
      case path.includes('/public/hosts') && method === 'GET':
        return await handleGetPublicHosts(queryStringParameters);
      
      case path.includes('/public/stats') && method === 'GET':
        return await handleGetPublicStats();
      
      case path.includes('/public/health') && method === 'GET':
        return await handleHealthCheck();
      
      default:
        return response.error('Not Found', 404);
    }
  } catch (error) {
    console.error('Public handler error:', error);
    return response.error('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error');
  }
};

async function handleGetPublicHosts(queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { 
      industry, 
      location, 
      experienceType, 
      careerField, 
      dcMetroAccessible,
      federalAgency,
      citizenshipRequired,
      springBreakAvailable,
      umdAlumni,
      limit = '50',
      lastEvaluatedKey 
    } = queryParams;

    // Get all verified hosts who have visibility enabled
    let params: any = {
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :role',
      ExpressionAttributeValues: {
        ':role': 'ROLE#host',
      },
      FilterExpression: 'verified = :verified',
      ExpressionAttributeNames: {},
      Limit: parseInt(limit),
    };

    params.ExpressionAttributeValues[':verified'] = true;

    // Add filters based on query parameters
    let filterExpressions = ['verified = :verified'];

    if (industry) {
      filterExpressions.push('contains(industry, :industry)');
      params.ExpressionAttributeValues[':industry'] = industry;
    }

    if (location) {
      filterExpressions.push('contains(#location, :location)');
      params.ExpressionAttributeValues[':location'] = location;
      params.ExpressionAttributeNames['#location'] = 'location';
    }

    if (experienceType) {
      filterExpressions.push('experienceType = :experienceType');
      params.ExpressionAttributeValues[':experienceType'] = experienceType;
    }

    if (careerField) {
      filterExpressions.push('contains(careerFields, :careerField)');
      params.ExpressionAttributeValues[':careerField'] = careerField;
    }

    if (dcMetroAccessible === 'true') {
      filterExpressions.push('dcMetroAccessible = :dcMetroAccessible');
      params.ExpressionAttributeValues[':dcMetroAccessible'] = true;
    }

    if (federalAgency === 'true') {
      filterExpressions.push('federalAgency = :federalAgency');
      params.ExpressionAttributeValues[':federalAgency'] = true;
    }

    if (citizenshipRequired !== undefined) {
      filterExpressions.push('citizenshipRequired = :citizenshipRequired');
      params.ExpressionAttributeValues[':citizenshipRequired'] = citizenshipRequired === 'true';
    }

    if (springBreakAvailable === 'true') {
      filterExpressions.push('springBreakAvailable = :springBreakAvailable');
      params.ExpressionAttributeValues[':springBreakAvailable'] = true;
    }

    if (umdAlumni === 'true') {
      filterExpressions.push('umdAlumni = :umdAlumni');
      params.ExpressionAttributeValues[':umdAlumni'] = true;
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const hosts = await db.query(params);

    // Filter out sensitive information for public view
    const publicHosts = hosts.map((host: any) => ({
      userId: host.userId,
      firstName: host.firstName,
      lastName: host.lastName,
      jobTitle: host.jobTitle,
      organization: host.organization,
      industry: host.industry,
      careerFields: host.careerFields,
      experienceType: host.experienceType,
      location: host.location,
      workLocation: host.workLocation,
      bio: host.bio,
      website: host.website,
      dcMetroAccessible: host.dcMetroAccessible,
      federalAgency: host.federalAgency,
      citizenshipRequired: host.citizenshipRequired,
      availabilityDays: host.availabilityDays,
      springBreakAvailable: host.springBreakAvailable,
      umdAlumni: host.umdAlumni,
      maxStudents: host.maxStudents,
      spotsAvailable: host.spotsAvailable,
      hostExpectations: host.hostExpectations,
      additionalInfo: host.additionalInfo,
      // Exclude: email, phone, internal notes, etc.
    }));

    return response.success({
      hosts: publicHosts,
      count: publicHosts.length,
      filters: {
        industry,
        location,
        experienceType,
        careerField,
        dcMetroAccessible: dcMetroAccessible === 'true',
        federalAgency: federalAgency === 'true',
        citizenshipRequired: citizenshipRequired === 'true',
        springBreakAvailable: springBreakAvailable === 'true',
        umdAlumni: umdAlumni === 'true',
      },
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Get public hosts error:', error);
    return response.error('Failed to retrieve hosts', 500);
  }
}

async function handleGetPublicStats(): Promise<APIGatewayProxyResult> {
  try {
    // Get basic public statistics
    const studentCount = await getCountByRole('student');
    const hostCount = await getCountByRole('host');
    
    // Get verified host count
    const verifiedHosts = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :role',
      FilterExpression: 'verified = :verified',
      ExpressionAttributeValues: {
        ':role': 'ROLE#host',
        ':verified': true,
      },
    });

    // Get current semester setting
    const currentSemester = getCurrentSemester();

    return response.success({
      totalStudents: studentCount,
      totalHosts: hostCount,
      verifiedHosts: verifiedHosts.length,
      currentSemester,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    return response.error('Failed to retrieve statistics', 500);
  }
}

async function handleHealthCheck(): Promise<APIGatewayProxyResult> {
  try {
    // Perform basic health checks
    const timestamp = new Date().toISOString();
    
    // Test database connectivity
    const healthCheck = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: 'HEALTH_CHECK',
        SK: 'TEST',
      },
    });

    return response.success({
      status: 'healthy',
      timestamp,
      version: '1.0.0',
      environment: process.env.STAGE || 'development',
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    return response.error('Health check failed', 500, {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function getCountByRole(role: string): Promise<number> {
  try {
    const users = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :role',
      ExpressionAttributeValues: {
        ':role': `ROLE#${role}`,
      },
    });

    return users.length || 0;
  } catch (error) {
    console.error(`Error getting count for role ${role}:`, error);
    return 0;
  }
}

function getCurrentSemester(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JavaScript months are 0-based
  
  // Determine semester based on month
  if (month >= 1 && month <= 5) {
    return `Spring${year}`;
  } else if (month >= 6 && month <= 8) {
    return `Summer${year}`;
  } else {
    return `Fall${year}`;
  }
}
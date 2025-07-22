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

    const currentUser = await auth.getUserFromToken(event);

    // All admin endpoints require admin role
    if (!auth.requireRole(currentUser.role, 'admin')) {
      return response.error('Admin access required', 403);
    }

    switch (true) {
      case path.includes('/admin/settings') && method === 'GET':
        return await handleGetSettings(queryStringParameters);
      
      case path.includes('/admin/settings') && method === 'POST':
        return await handleUpdateSetting(body);
      
      case path.includes('/admin/stats') && method === 'GET':
        return await handleGetStats(queryStringParameters);
      
      case path.includes('/admin/users') && method === 'GET':
        return await handleGetAllUsers(queryStringParameters);
      
      case path.includes('/admin/users/{userId}') && method === 'PUT':
        return await handleUpdateUser(pathParameters.userId!, body);
      
      case path.includes('/admin/users/{userId}') && method === 'DELETE':
        return await handleDeleteUser(pathParameters.userId!);
      
      case path.includes('/admin/applications') && method === 'GET':
        return await handleGetAllApplications(queryStringParameters);
      
      case path.includes('/admin/matches') && method === 'GET':
        return await handleGetAllMatches(queryStringParameters);
      
      case path.includes('/admin/export') && method === 'POST':
        return await handleExportData(body);
      
      case path.includes('/admin/bulk-import') && method === 'POST':
        return await handleBulkImport(body);
      
      default:
        return response.error('Not Found', 404);
    }
  } catch (error) {
    console.error('Admin handler error:', error);
    return response.error('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error');
  }
};

async function handleGetSettings(queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester } = queryParams;
    const currentSemester = semester || getCurrentSemester();

    const settings = await db.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :settingsKey AND begins_with(SK, :semesterPrefix)',
      ExpressionAttributeValues: {
        ':settingsKey': 'SETTINGS',
        ':semesterPrefix': `${currentSemester}#`,
      },
    });

    const settingsMap: any = {};
    settings.forEach((setting: any) => {
      settingsMap[setting.key] = setting.value;
    });

    return response.success({
      semester: currentSemester,
      settings: settingsMap,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return response.error('Failed to retrieve settings', 500);
  }
}

async function handleUpdateSetting(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { key, value, semester } = body;

    validate.required(key, 'Setting key');
    validate.required(value, 'Setting value');

    const currentSemester = semester || getCurrentSemester();
    const setting = transform.settingToDynamoItem(key, value, currentSemester);

    await db.put({
      TableName: TABLE_NAME,
      Item: setting,
    });

    return response.success({
      message: 'Setting updated successfully',
      key,
      value,
      semester: currentSemester,
    });
  } catch (error) {
    console.error('Update setting error:', error);
    return response.error('Failed to update setting', 500);
  }
}

async function handleGetStats(queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester } = queryParams;
    const currentSemester = semester || getCurrentSemester();

    // Get user counts by role
    const studentCount = await getCountByRole('student');
    const hostCount = await getCountByRole('host');
    const adminCount = await getCountByRole('admin');

    // Get application stats for the semester
    const applications = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :semester',
      ExpressionAttributeValues: {
        ':semester': `SEMESTER#${currentSemester}`,
      },
    });

    const applicationStats = {
      total: applications.length,
      submitted: applications.filter((app: any) => app.status === 'submitted').length,
      reviewed: applications.filter((app: any) => app.status === 'reviewed').length,
      matched: applications.filter((app: any) => app.status === 'matched').length,
      completed: applications.filter((app: any) => app.status === 'completed').length,
    };

    // Get match stats
    const matches = await db.query({
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(PK, :matchPrefix) AND semester = :semester',
      ExpressionAttributeValues: {
        ':matchPrefix': 'MATCH#',
        ':semester': currentSemester,
      },
    });

    const matchStats = {
      total: matches.length,
      confirmed: matches.filter((match: any) => match.status === 'confirmed').length,
      completed: matches.filter((match: any) => match.status === 'completed').length,
    };

    return response.success({
      semester: currentSemester,
      users: {
        students: studentCount,
        hosts: hostCount,
        admins: adminCount,
        total: studentCount + hostCount + adminCount,
      },
      applications: applicationStats,
      matches: matchStats,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return response.error('Failed to retrieve statistics', 500);
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
      Select: 'COUNT',
    });

    return users.length || 0;
  } catch (error) {
    console.error(`Error getting count for role ${role}:`, error);
    return 0;
  }
}

async function handleGetAllUsers(queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { role, limit = '100', lastEvaluatedKey } = queryParams;

    let params: any = {
      TableName: TABLE_NAME,
      Limit: parseInt(limit),
    };

    if (role && ['student', 'host', 'admin'].includes(role)) {
      params.IndexName = 'GSI2';
      params.KeyConditionExpression = 'GSI2PK = :role';
      params.ExpressionAttributeValues = {
        ':role': `ROLE#${role}`,
      };
    } else {
      params.FilterExpression = 'begins_with(PK, :userPrefix)';
      params.ExpressionAttributeValues = {
        ':userPrefix': 'USER#',
      };
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const users = await db.query(params);

    return response.success({
      users,
      count: users.length,
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return response.error('Failed to retrieve users', 500);
  }
}

async function handleUpdateUser(userId: string, body: any): Promise<APIGatewayProxyResult> {
  try {
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

    const { userId: _, PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, createdAt, ...updateData } = body;

    const updatedProfile = {
      ...userProfile,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await db.put({
      TableName: TABLE_NAME,
      Item: updatedProfile,
    });

    return response.success(updatedProfile);
  } catch (error) {
    console.error('Update user error:', error);
    return response.error('Failed to update user', 500);
  }
}

async function handleDeleteUser(userId: string): Promise<APIGatewayProxyResult> {
  try {
    // Check if user exists
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

    // Delete user profile
    await db.delete({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
    });

    // Note: In a production system, you might want to:
    // 1. Archive the user data instead of deleting
    // 2. Handle related records (applications, matches, etc.)
    // 3. Remove user from Cognito User Pool

    return response.success({
      message: 'User deleted successfully',
      userId,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return response.error('Failed to delete user', 500);
  }
}

async function handleGetAllApplications(queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester, status, limit = '100', lastEvaluatedKey } = queryParams;

    let params: any = {
      TableName: TABLE_NAME,
      Limit: parseInt(limit),
    };

    if (semester) {
      params.IndexName = 'GSI2';
      params.KeyConditionExpression = 'GSI2PK = :semester';
      params.ExpressionAttributeValues = {
        ':semester': `SEMESTER#${semester}`,
      };
    } else {
      params.FilterExpression = 'begins_with(PK, :applicationPrefix)';
      params.ExpressionAttributeValues = {
        ':applicationPrefix': 'APPLICATION#',
      };
    }

    if (status) {
      const filterExpression = '#status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      if (!params.ExpressionAttributeValues) params.ExpressionAttributeValues = {};
      params.ExpressionAttributeValues[':status'] = status;
      
      if (params.FilterExpression) {
        params.FilterExpression += ` AND ${filterExpression}`;
      } else {
        params.FilterExpression = filterExpression;
      }
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const applications = await db.query(params);

    return response.success({
      applications,
      count: applications.length,
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    return response.error('Failed to retrieve applications', 500);
  }
}

async function handleGetAllMatches(queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester, status, limit = '100', lastEvaluatedKey } = queryParams;

    let params: any = {
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(PK, :matchPrefix)',
      ExpressionAttributeValues: {
        ':matchPrefix': 'MATCH#',
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

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const matches = await db.query(params);

    return response.success({
      matches,
      count: matches.length,
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Get all matches error:', error);
    return response.error('Failed to retrieve matches', 500);
  }
}

async function handleExportData(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { dataType, semester, format = 'json' } = body;

    validate.required(dataType, 'Data type');

    if (!['users', 'applications', 'matches', 'settings'].includes(dataType)) {
      return response.error('Invalid data type');
    }

    if (!['json', 'csv'].includes(format)) {
      return response.error('Invalid export format');
    }

    let data: any[] = [];

    switch (dataType) {
      case 'users':
        data = await db.query({
          TableName: TABLE_NAME,
          FilterExpression: 'begins_with(PK, :prefix)',
          ExpressionAttributeValues: { ':prefix': 'USER#' },
        });
        break;
      
      case 'applications':
        if (semester) {
          data = await db.query({
            TableName: TABLE_NAME,
            IndexName: 'GSI2',
            KeyConditionExpression: 'GSI2PK = :semester',
            ExpressionAttributeValues: { ':semester': `SEMESTER#${semester}` },
          });
        } else {
          data = await db.query({
            TableName: TABLE_NAME,
            FilterExpression: 'begins_with(PK, :prefix)',
            ExpressionAttributeValues: { ':prefix': 'APPLICATION#' },
          });
        }
        break;
      
      case 'matches':
        data = await db.query({
          TableName: TABLE_NAME,
          FilterExpression: 'begins_with(PK, :prefix)',
          ExpressionAttributeValues: { ':prefix': 'MATCH#' },
        });
        if (semester) {
          data = data.filter((match: any) => match.semester === semester);
        }
        break;
      
      case 'settings':
        data = await db.query({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'PK = :settingsKey',
          ExpressionAttributeValues: { ':settingsKey': 'SETTINGS' },
        });
        break;
    }

    return response.success({
      dataType,
      format,
      semester,
      recordCount: data.length,
      data,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Export data error:', error);
    return response.error('Failed to export data', 500);
  }
}

async function handleBulkImport(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { dataType, data, options = {} } = body;

    validate.required(dataType, 'Data type');
    validate.required(data, 'Data array');

    if (!Array.isArray(data)) {
      return response.error('Data must be an array');
    }

    if (!['users', 'hosts', 'settings'].includes(dataType)) {
      return response.error('Invalid data type for bulk import');
    }

    let imported = 0;
    let errors: any[] = [];

    for (const item of data) {
      try {
        let dynamoItem;
        
        if (dataType === 'users' || dataType === 'hosts') {
          dynamoItem = transform.userToDynamoItem(item, dataType === 'hosts' ? 'host' : item.role || 'student');
        } else if (dataType === 'settings') {
          dynamoItem = transform.settingToDynamoItem(item.key, item.value, item.semester);
        }

        await db.put({
          TableName: TABLE_NAME,
          Item: dynamoItem,
        });
        
        imported++;
      } catch (error) {
        errors.push({
          item,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return response.success({
      message: 'Bulk import completed',
      dataType,
      totalRecords: data.length,
      imported,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    return response.error('Failed to import data', 500);
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
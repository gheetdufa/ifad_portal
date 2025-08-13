import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Use shared utilities from Lambda layer
let utils;
try { 
  utils = require('/opt/nodejs/utils'); 
} catch { 
  utils = require('../../layers/shared/nodejs/utils'); 
}
  const { response, db, auth, validate, transform, helpers } = utils;
  const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
  const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.resource;
    const method = event.httpMethod;
    const pathParameters = event.pathParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};
    const queryStringParameters = event.queryStringParameters || {};

    console.log(`Users handler processing ${method} ${path}`, {
      pathParameters,
      queryStringParameters,
      table: TABLE_NAME,
      region: process.env.AWS_REGION || 'us-east-1'
    });

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
        return await handleGetUserById(currentUser, pathParameters.userId!, queryStringParameters);
      
      case path.includes('/users/hosts') && method === 'GET':
        return await handleGetHosts(currentUser, queryStringParameters);
      
      case path.includes('/users/semester-registration') && method === 'POST':
        return await handleSemesterRegistration(currentUser, body);
      
      case path.includes('/users/semester-registration') && method === 'GET':
        return await handleGetSemesterRegistration(currentUser, queryStringParameters);
      
      case path.includes('/users/semester-registration') && method === 'PUT':
        return await handleUpdateSemesterRegistration(currentUser, body);
      
      default:
        return response.error('Not Found', 404);
    }
  } catch (error) {
    console.error('Users handler error:', error);
    return response.error('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error');
  }
};

// Normalize semester strings to canonical format like "Fall2025" or "Spring2026"
function normalizeSemesterLabel(input: string | undefined): string | undefined {
  if (!input) return input;
  const yearMatch = String(input).match(/(20\d{2})/);
  const year = yearMatch ? yearMatch[1] : undefined;
  const lower = String(input).toLowerCase();
  const term = lower.includes('fall') ? 'Fall' : lower.includes('spring') ? 'Spring' : undefined;
  if (term && year) return `${term}${year}`;
  // Fallback: strip spaces to reduce mismatches
  return String(input).replace(/\s+/g, '');
}

/**
 * Get current user's profile
 * Returns complete profile with role-specific data
 */
async function handleGetProfile(currentUser: any): Promise<APIGatewayProxyResult> {
  try {
    console.log(`Getting profile for user ${currentUser.userId}`);

    const userProfile = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${currentUser.userId}`,
        SK: 'PROFILE',
      },
    });

    if (!userProfile) {
      console.log(`Profile not found for user ${currentUser.userId}`);
      return response.error('Profile not found', 404);
    }

    console.log(`Found profile for user ${currentUser.userId}, role: ${userProfile.role}, status: ${userProfile.status}`);

    // For hosts, also get their current semester registrations
    if (userProfile.role === 'host') {
      try {
        // Use admin-configured semester if available
        let adminSemester = null as string | null;
        try {
          const setting = await db.get({ TableName: TABLE_NAME, Key: { PK: 'SETTINGS', SK: 'CURRENT_SEMESTER' } });
          adminSemester = setting?.value || null;
        } catch {}
        const currentSemester = adminSemester || helpers.getCurrentSemester();
        const semesterRegistration = await db.get({
          TableName: TABLE_NAME,
          Key: {
            PK: `USER#${currentUser.userId}`,
            SK: `SEMESTER#${currentSemester}`,
          },
        });

        userProfile.currentSemesterRegistration = semesterRegistration || null;
        userProfile.currentSemester = currentSemester;
      } catch (error) {
        console.log('Error getting semester registration:', error);
        // Don't fail the request if semester data is unavailable
      }
    }

    return response.success(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    return response.error('Failed to retrieve profile', 500);
  }
}

/**
 * Update user profile
 * Allows users to update their own profile, admins can update any
 */
async function handleUpdateProfile(currentUser: any, body: any): Promise<APIGatewayProxyResult> {
  try {
    const { userId, email, role, createdAt, PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...updateData } = body;

    console.log(`Update profile request for user ${currentUser.userId}`);

    // Validate authorization
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

    // Prevent users from changing their verification status (only admins can)
    if (currentUser.role !== 'admin') {
      delete updateData.verified;
      delete updateData.status;
    }

    // Determine if profile just transitioned to complete
    const isNowComplete = updateData.profileStage === 'complete' && currentProfile.profileStage !== 'complete';

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

    console.log(`Successfully updated profile for user ${currentUser.userId}`);

    // Fire-and-forget: send boilerplate email when profile becomes complete
    if (isNowComplete) {
      const fromEmail = process.env.FROM_EMAIL || 'no-reply@ifad.local';
      const toEmail = updatedProfile.email || currentUser.email;
      if (toEmail) {
        const subject = 'IFAD Host Profile Submitted';
        const bodyText = 'Thank you for submitting your IFAD host profile. Our team will review it and follow up with next steps.';
        const bodyHtml = `<p>Thank you for submitting your <strong>IFAD host profile</strong>.</p><p>Our team will review it and follow up with next steps.</p>`;
        try {
          await ses.send(new SendEmailCommand({
            Destination: { ToAddresses: [toEmail] },
            Message: {
              Subject: { Data: subject },
              Body: {
                Text: { Data: bodyText },
                Html: { Data: bodyHtml },
              },
            },
            Source: fromEmail,
          }));
          console.log('Profile completion email sent to', toEmail);
        } catch (err) {
          console.warn('Failed to send profile completion email:', (err as any)?.message || err);
        }
      }
    }

    return response.success({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return response.error('Failed to update profile', 500);
  }
}

/**
 * Search users by role and other criteria
 * Admin and host access only
 */
async function handleSearchUsers(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { role, limit = '50', lastEvaluatedKey, status } = queryParams;

    if (!auth.requireRole(currentUser.role, ['admin', 'host'])) {
      return response.error('Not authorized to search users', 403);
    }

    console.log(`User search request: role=${role}, status=${status}, limit=${limit}`);

    if (!role || !['student', 'host', 'admin'].includes(role)) {
      return response.error('Valid role parameter is required', 400);
    }

    const params: any = {
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :role',
      ExpressionAttributeValues: {
        ':role': `ROLE#${role}`,
      },
      Limit: parseInt(limit),
    };

    // Add status filter if specified
    if (status && status !== 'all') {
      params.FilterExpression = '#status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues[':status'] = status;
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const users = await db.query(params);

    console.log(`Found ${users.length} users with role ${role}`);

    return response.success({
      users,
      count: users.length,
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Search users error:', error);
    return response.error('Failed to search users', 500);
  }
}

/**
 * Get user profile by ID
 * Users can view their own, admins can view any
 */
async function handleGetUserById(currentUser: any, userId: string, queryParams?: any): Promise<APIGatewayProxyResult> {
  try {
    // Authorization check
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

    // If admin viewing a host, enrich with semester registration (requested semester or current)
    if (currentUser.role === 'admin' && userProfile.role === 'host') {
      try {
        const requestedSemester = queryParams?.semester;
        // Respect admin-configured current semester if no explicit semester requested
        let adminSemester = null as string | null;
        try {
          const setting = await db.get({ TableName: TABLE_NAME, Key: { PK: 'SETTINGS', SK: 'CURRENT_SEMESTER' } });
          adminSemester = setting?.value || null;
        } catch {}
        const currentSemester = requestedSemester || adminSemester || helpers.getCurrentSemester();
        const semesterRegistration = await db.get({
          TableName: TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `SEMESTER#${currentSemester}`,
          },
        });
        (userProfile as any).currentSemesterRegistration = semesterRegistration || null;
        (userProfile as any).currentSemester = currentSemester;
      } catch (error) {
        console.log('Error getting semester registration (admin view):', error);
      }
    }

    return response.success(userProfile);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return response.error('Failed to retrieve user', 500);
  }
}

/**
 * Get hosts with filtering options
 * Available to all authenticated users
 */
async function handleGetHosts(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { limit = '50', verified, location, lastEvaluatedKey } = queryParams;

    console.log(`Getting hosts: verified=${verified}, location=${location}`);

    // Get all hosts
    const params: any = {
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :role',
      ExpressionAttributeValues: {
        ':role': 'ROLE#host',
      },
      Limit: parseInt(limit),
    };

    // Build filter expressions
    const filterExpressions = [];
    const expressionAttributeNames: any = {};

    // Only show verified hosts to non-admin users
    if (currentUser.role !== 'admin') {
      filterExpressions.push('verified = :verified AND #status = :approved');
      params.ExpressionAttributeValues[':verified'] = true;
      params.ExpressionAttributeValues[':approved'] = 'approved';
      expressionAttributeNames['#status'] = 'status';
    } else if (verified === 'true') {
      filterExpressions.push('verified = :verified');
      params.ExpressionAttributeValues[':verified'] = true;
    } else if (verified === 'false') {
      filterExpressions.push('verified = :verified');
      params.ExpressionAttributeValues[':verified'] = false;
    }

    if (location) {
      filterExpressions.push('contains(workLocation, :location)');
      params.ExpressionAttributeValues[':location'] = location;
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    }

    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const hosts = await db.query(params);

    console.log(`Found ${hosts.length} hosts`);

    return response.success({
      hosts,
      count: hosts.length,
      lastEvaluatedKey: params.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(params.LastEvaluatedKey)) : null,
    });
  } catch (error) {
    console.error('Get hosts error:', error);
    return response.error('Failed to retrieve hosts', 500);
  }
}

/**
 * Register host for a specific semester
 * Only approved hosts can register
 */
async function handleSemesterRegistration(currentUser: any, body: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester, maxStudents, availableDays, experienceType, additionalInfo } = body;

    const normalizedSemester = normalizeSemesterLabel(semester);

    console.log(`Semester registration request for user ${currentUser.userId}, semester: ${semester} (normalized: ${normalizedSemester})`);

    // Validate required fields
    validate.required(semester, 'Semester');
    validate.required(maxStudents, 'Max students');

    if (maxStudents < 1 || maxStudents > 10) {
      return response.error('Max students must be between 1 and 10', 400);
    }

    // Only hosts can register for semesters
    if (currentUser.role !== 'host') {
      return response.error('Only hosts can register for semesters', 403);
    }

    // Option 2: Allow hosts to register for semester before admin approval
    // Approval will still be required later in the matching/visibility flow

    // Check if already registered for this semester (single key per semester)
    const existingRegistration = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${currentUser.userId}`,
        SK: `SEMESTER#${normalizedSemester}`,
      },
    });
    
    // If a record exists, merge experience types and update instead of failing
    if (existingRegistration) {
      const existingTypes: string[] = Array.isArray((existingRegistration as any).experienceTypes)
        ? (existingRegistration as any).experienceTypes
        : ((existingRegistration as any).experienceType ? [(existingRegistration as any).experienceType] : []);
      const incomingTypes: string[] = experienceType === 'both' ? ['in-person', 'virtual'] : [experienceType || 'in-person'];
      const mergedTypes = Array.from(new Set([...existingTypes, ...incomingTypes]));

      const updatedRegistration = {
        ...existingRegistration,
        experienceTypes: mergedTypes,
        // Keep legacy field for compatibility (first of types)
        experienceType: mergedTypes[0],
        maxStudents: maxStudents ? parseInt(maxStudents) : existingRegistration.maxStudents,
        availableDays: availableDays || existingRegistration.availableDays || [],
        additionalInfo: additionalInfo !== undefined ? additionalInfo : (existingRegistration as any).additionalInfo || '',
        updatedAt: new Date().toISOString(),
      };

      await db.put({ TableName: TABLE_NAME, Item: updatedRegistration });
      console.log(`Merged semester registration for user ${currentUser.userId}, semester ${semester}`);
      return response.success({
        message: 'Semester registration updated',
        registration: updatedRegistration,
      });
    }

    // Create semester registration (supports both)
    const experienceTypes = experienceType === 'both' ? ['in-person', 'virtual'] : [experienceType || 'in-person'];
    const registrationData = {
      PK: `USER#${currentUser.userId}`,
      SK: `SEMESTER#${normalizedSemester}`,
      GSI2PK: `ROLE#host`,
      GSI2SK: `SEMESTER#${normalizedSemester}`,
      userId: currentUser.userId,
      semester: normalizedSemester,
      maxStudents: parseInt(maxStudents),
      availableDays: availableDays || [],
      experienceTypes,
      experienceType: experienceTypes[0],
      additionalInfo: additionalInfo || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entityType: 'SEMESTER_REGISTRATION',
    } as any;

    await db.put({ TableName: TABLE_NAME, Item: registrationData });
    console.log(`Successfully created semester registration for user ${currentUser.userId}, semester ${semester}`);
    return response.success({ message: 'Successfully registered for semester', registration: registrationData });
  } catch (error) {
    console.error('Semester registration error:', error);
    return response.error('Failed to register for semester', 500);
  }
}

/**
 * Get semester registration for current user
 */
async function handleGetSemesterRegistration(currentUser: any, queryParams: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester } = queryParams;

    // Determine semester: explicit > admin-configured > helper
    let adminSemester = null as string | null;
    try {
      const setting = await db.get({ TableName: TABLE_NAME, Key: { PK: 'SETTINGS', SK: 'CURRENT_SEMESTER' } });
      adminSemester = setting?.value || null;
    } catch {}
    const targetSemesterRaw = semester || adminSemester || helpers.getCurrentSemester();
    const targetSemester = normalizeSemesterLabel(targetSemesterRaw)!;

    console.log(`Getting semester registration for user ${currentUser.userId}, semester: ${targetSemester}`);

    const registration = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${currentUser.userId}`,
        SK: `SEMESTER#${targetSemester}`,
      },
    });

    return response.success({
      registered: !!registration,
      registration: registration || null,
      semester: targetSemester,
    });
  } catch (error) {
    console.error('Get semester registration error:', error);
    return response.error('Failed to retrieve semester registration', 500);
  }
}

/**
 * Update existing semester registration
 */
async function handleUpdateSemesterRegistration(currentUser: any, body: any): Promise<APIGatewayProxyResult> {
  try {
    const { semester, maxStudents, availableDays, experienceType, additionalInfo } = body;

    const targetSemester = semester || helpers.getCurrentSemester();

    console.log(`Updating semester registration for user ${currentUser.userId}, semester: ${targetSemester}`);

    // Get existing registration
    const existingRegistration = await db.get({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${currentUser.userId}`,
        SK: `SEMESTER#${targetSemester}`,
      },
    });

    if (!existingRegistration) {
      return response.error('Registration not found for this semester', 404, {
        semester: targetSemester,
        message: 'Create a registration first'
      });
    }

    // Update registration
    const updatedRegistration = {
      ...existingRegistration,
      maxStudents: maxStudents ? parseInt(maxStudents) : existingRegistration.maxStudents,
      availableDays: availableDays !== undefined ? availableDays : existingRegistration.availableDays,
      experienceType: experienceType || existingRegistration.experienceType,
      additionalInfo: additionalInfo !== undefined ? additionalInfo : existingRegistration.additionalInfo,
      updatedAt: new Date().toISOString(),
    };

    await db.put({
      TableName: TABLE_NAME,
      Item: updatedRegistration,
    });

    console.log(`Successfully updated semester registration for user ${currentUser.userId}`);

    return response.success({
      message: 'Semester registration updated successfully',
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error('Update semester registration error:', error);
    return response.error('Failed to update semester registration', 500);
  }
}
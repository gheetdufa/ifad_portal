import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, InitiateAuthCommand, AdminAddUserToGroupCommand, AdminCreateUserCommand, AdminSetUserPasswordCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { v4 as uuidv4 } from 'uuid';

// Use shared utilities from Lambda layer
let utils;
try { 
  utils = require('/opt/nodejs/utils'); 
} catch { 
  utils = require('../../layers/shared/nodejs/utils'); 
}
const { response, db, validate, transform, helpers } = utils;

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
const TABLE_NAME = process.env.TABLE_NAME!;
const USER_POOL_ID = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.resource;
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    console.log(`Auth handler processing ${method} ${path}`, { 
      email: body.email, 
      role: body.role,
      hasPassword: !!body.password,
      table: TABLE_NAME,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    switch (true) {
      case path.includes('/auth/register') && method === 'POST':
        return await handleRegister(body);
      
      case path.includes('/auth/login') && method === 'POST':
        return await handleLogin(body);
      
      case path.includes('/auth/confirm') && method === 'POST':
        return await handleConfirmSignUp(body);
      
      case path.includes('/auth/forgot') && method === 'POST':
        return await handleForgotPassword(body);
      
      case path.includes('/auth/reset') && method === 'POST':
        return await handleConfirmForgotPassword(body);
      
      default:
        return response.error('Not Found', 404);
    }
  } catch (error) {
    console.error('Auth handler error:', error);
    return response.error('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error');
  }
};

/**
 * Handle user registration with complete profile creation
 * Supports host registration with full profile data
 */
async function handleRegister(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email, password, firstName, lastName, role = 'student', ...additionalData } = body;

    console.log(`Registration attempt for ${email} with role ${role}`);

    // Basic validation
    validate.required(email, 'Email');
    validate.email(email);
    validate.required(password, 'Password');
    validate.password(password);
    validate.required(firstName, 'First name');
    validate.required(lastName, 'Last name');
    validate.role(role);

    // Host-specific validation
    // Option 2: allow minimal host account creation first, profile later
    if (role === 'host') {
      const hasFullHostProfile = !!(
        additionalData.jobTitle &&
        additionalData.organization &&
        additionalData.workLocation &&
        additionalData.workPhone &&
        additionalData.careerFields && Array.isArray(additionalData.careerFields) && additionalData.careerFields.length > 0
      );
      if (hasFullHostProfile) {
        validate.hostRegistration({
          email, password, firstName, lastName,
          jobTitle: additionalData.jobTitle,
          organization: additionalData.organization,
          workLocation: additionalData.workLocation,
          workPhone: additionalData.workPhone,
          careerFields: additionalData.careerFields
        });
      }
    }

    // Check if user already exists
    const existingUser = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: {
        ':email': `EMAIL#${email}`,
      },
    });

    if (existingUser && existingUser.length > 0) {
      return response.error('User with this email already exists', 409);
    }

    // Create user in Cognito User Pool
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      MessageAction: 'SUPPRESS', // Skip email verification for smoother UX
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
      ],
    });

    console.log(`Creating Cognito user for ${email}`);
    const createUserResult = await cognito.send(createUserCommand);
    const userId = createUserResult.User?.Attributes?.find(a => a.Name === 'sub')?.Value;

    if (!userId) {
      throw new Error('Failed to get user ID from Cognito');
    }

    // Set permanent password
    const setPwdCommand = new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    });
    await cognito.send(setPwdCommand);

    // Add user to appropriate Cognito group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      GroupName: role,
    });
    await cognito.send(addToGroupCommand);

    console.log(`Added user ${email} to group ${role}`);

    // Create comprehensive user profile in DynamoDB
    const userData = {
      userId,
      email,
      firstName,
      lastName,
      ...additionalData,
    };

    // For minimal host accounts, mark profile stage and pending status
    if (role === 'host') {
      const hasFullHostProfile = !!(
        additionalData.jobTitle &&
        additionalData.organization &&
        additionalData.workLocation &&
        additionalData.workPhone &&
        additionalData.careerFields && Array.isArray(additionalData.careerFields) && additionalData.careerFields.length > 0
      );
      if (!hasFullHostProfile) {
        (userData as any).status = 'pending_profile';
        (userData as any).verified = false;
        (userData as any).profileStage = 'incomplete';
      }
    }

    const dynamoItem = transform.userToDynamoItem(userData, role);
    const redacted = { ...userData, password: userData?.password ? '***' : undefined };
    console.log('Registering user profile in DynamoDB', {
      table: TABLE_NAME,
      keys: { PK: `USER#${userId}`, SK: 'PROFILE' },
      gsi: { GSI1PK: `EMAIL#${email}`, GSI2PK: `ROLE#${role}` },
      role,
      preview: redacted
    });

    await db.put({
      TableName: TABLE_NAME,
      Item: dynamoItem,
    });

    console.log(`Created DynamoDB profile for user ${userId}`);

    // Return appropriate response based on role
    if (role === 'host') {
      return response.success({
        message: 'Host account created successfully. You can now log in and complete your profile. Admin approval is still required before semester registration.',
        userId,
        email,
        role,
        status: (userData as any).status || 'pending',
        nextSteps: [
          'Log in to your account',
          'Complete your IFAD host profile',
          'Admin approval is required before semester registration'
        ]
      }, 201);
    }

    return response.success({
      message: 'User registered successfully',
      userId,
      email,
      role,
      status: role === 'admin' ? 'approved' : 'pending'
    }, 201);

  } catch (error: any) {
    console.error('Register error:', error);
    
    if (error.name === 'UsernameExistsException') {
      return response.error('User with this email already exists', 409);
    }
    
    if (error.name === 'InvalidParameterException') {
      return response.error('Invalid registration data: ' + error.message, 400);
    }
    
    return response.error('Registration failed', 500, error.message);
  }
}

/**
 * Handle user login with role-based access control
 * Returns user profile and authorization token
 */
async function handleLogin(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email, password } = body;

    validate.required(email, 'Email');
    validate.email(email);
    validate.required(password, 'Password');

    console.log(`Login attempt for ${email}`);

    // Authenticate with Cognito
    const authCommand = new InitiateAuthCommand({
      ClientId: USER_POOL_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const authResult = await cognito.send(authCommand);

    if (!authResult.AuthenticationResult) {
      return response.error('Authentication failed', 401);
    }

    const { AccessToken, IdToken, RefreshToken } = authResult.AuthenticationResult;

    // Get user profile from DynamoDB
    let userProfiles = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: {
        ':email': `EMAIL#${email}`,
      },
    });

    // If user authenticated with Cognito but no profile exists yet, auto-provision a minimal profile
    if (!userProfiles || userProfiles.length === 0) {
      // Decode IdToken without verification to extract claims (groups, names)
      const decodeJwt = (token: string) => {
        try {
          const parts = token.split('.');
          if (parts.length < 2) return {};
          const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
          const json = Buffer.from(padded, 'base64').toString('utf8');
          return JSON.parse(json);
        } catch {
          return {};
        }
      };

      const claims: any = IdToken ? decodeJwt(IdToken) : {};
      const groups: string[] = Array.isArray(claims['cognito:groups']) ? claims['cognito:groups'] : [];
      const inferredRole = groups.includes('admin') ? 'admin' : groups.includes('host') ? 'host' : 'student';

      const minimalUser = {
        userId: claims['sub'] || uuidv4(),
        email,
        firstName: claims['given_name'] || claims['name'] || 'User',
        lastName: claims['family_name'] || '',
        role: inferredRole,
        status: inferredRole === 'host' ? 'pending' : 'approved',
        verified: inferredRole === 'admin' || inferredRole === 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const dynamoItem = transform.userToDynamoItem(minimalUser, inferredRole);
      await db.put({
        TableName: TABLE_NAME,
        Item: dynamoItem,
      });

      // Re-query to load the profile in the expected format
      userProfiles = await db.query({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :email',
        ExpressionAttributeValues: {
          ':email': `EMAIL#${email}`,
        },
      });
    }

    const profile = userProfiles[0];

    // Option 2: allow hosts to log in with incomplete or pending profiles
    // Gate semester registration elsewhere; here just tag the status in the response

    if (profile.role === 'host' && profile.status === 'rejected') {
      return response.error('Your host application was not approved. Please contact the administrator for more information.', 403, {
        status: 'rejected',
        message: 'Host registration was rejected'
      });
    }

    console.log(`Successful login for ${email} with role ${profile.role}`);

    return response.success({
      message: 'Login successful',
      token: AccessToken,
      refreshToken: RefreshToken,
      user: {
        id: profile.userId,
        userId: profile.userId,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        status: profile.status,
        verified: profile.verified,
        jobTitle: profile.jobTitle,
        organization: profile.organization,
      },
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'NotAuthorizedException' || error.name === 'UserNotFoundException') {
      return response.error('Invalid email or password', 401);
    }
    
    if (error.name === 'UserNotConfirmedException') {
      return response.error('Please confirm your account first', 401);
    }
    
    return response.error('Login failed', 500, error.message);
  }
}

/**
 * Handle signup confirmation (if email verification is enabled)
 * Currently not used as we auto-confirm users
 */
async function handleConfirmSignUp(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email, confirmationCode } = body;

    validate.required(email, 'Email');
    validate.required(confirmationCode, 'Confirmation code');

    // This would be used if email verification is enabled
    // For now, we auto-confirm users during registration for better UX
    
    return response.success({
      message: 'User confirmed successfully',
    });

  } catch (error: any) {
    console.error('Confirm signup error:', error);
    return response.error('Confirmation failed', 400, error.message);
  }
}

async function handleForgotPassword(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email } = body;
    validate.required(email, 'Email');
    validate.email(email);
    const cmd = new ForgotPasswordCommand({ ClientId: USER_POOL_CLIENT_ID, Username: email });
    try {
      await cognito.send(cmd);
    } catch (err) {
      // Swallow specific errors to avoid user enumeration; log for diagnostics
      console.warn('Cognito forgot password error (suppressed):', (err as any)?.name || err);
    }
    // Always return success to prevent account enumeration
    return response.success({ message: 'If an account exists for this email, a verification code has been sent.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    // Still return success to maintain UX and avoid enumeration
    return response.success({ message: 'If an account exists for this email, a verification code has been sent.' });
  }
}

async function handleConfirmForgotPassword(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email, code, newPassword } = body;
    validate.required(email, 'Email');
    validate.email(email);
    validate.required(code, 'Verification code');
    validate.required(newPassword, 'New password');
    validate.password(newPassword);
    const cmd = new ConfirmForgotPasswordCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });
    await cognito.send(cmd);
    return response.success({ message: 'Password has been reset successfully' });
  } catch (error: any) {
    console.error('Confirm forgot password error:', error);
    return response.error('Failed to reset password', 400, error.message);
  }
}
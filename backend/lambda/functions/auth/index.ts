import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, AdminConfirmSignUpCommand, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';
import { v4 as uuidv4 } from 'uuid';

const { response, db, transform, validate } = require('/opt/nodejs/utils');

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
const TABLE_NAME = process.env.TABLE_NAME!;
const USER_POOL_ID = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.resource;
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    console.log(`Processing ${method} ${path}`, { body: body ? 'present' : 'none' });

    switch (true) {
      case path.includes('/auth/register') && method === 'POST':
        return await handleRegister(body);
      
      case path.includes('/auth/login') && method === 'POST':
        return await handleLogin(body);
      
      case path.includes('/auth/confirm') && method === 'POST':
        return await handleConfirmSignUp(body);
      
      default:
        return response.error('Not Found', 404);
    }
  } catch (error) {
    console.error('Auth handler error:', error);
    return response.error('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error');
  }
};

async function handleRegister(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email, password, firstName, lastName, role = 'student', ...additionalData } = body;

    // Validate required fields
    validate.required(email, 'Email');
    validate.required(password, 'Password');
    validate.required(firstName, 'First name');
    validate.required(lastName, 'Last name');

    if (!validate.email(email)) {
      return response.error('Invalid email format');
    }

    if (password.length < 8) {
      return response.error('Password must be at least 8 characters long');
    }

    const validRoles = ['student', 'host', 'admin'];
    if (!validRoles.includes(role)) {
      return response.error('Invalid role');
    }

    // Create user in Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
      ],
    });

    const signUpResult = await cognito.send(signUpCommand);
    const userId = signUpResult.UserSub!;

    // Auto-confirm user (in production, you might want email verification)
    const confirmCommand = new AdminConfirmSignUpCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
    });
    await cognito.send(confirmCommand);

    // Add user to appropriate Cognito group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      GroupName: role,
    });
    await cognito.send(addToGroupCommand);

    // Create user profile in DynamoDB
    const userData = {
      userId,
      email,
      firstName,
      lastName,
      ...additionalData,
    };

    const dynamoItem = transform.userToDynamoItem(userData, role);
    
    await db.put({
      TableName: TABLE_NAME,
      Item: dynamoItem,
    });

    return response.success({
      message: 'User registered successfully',
      userId,
      email,
      role,
    }, 201);

  } catch (error: any) {
    console.error('Register error:', error);
    
    if (error.name === 'UsernameExistsException') {
      return response.error('User with this email already exists', 409);
    }
    
    return response.error('Registration failed', 400, error.message);
  }
}

async function handleLogin(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email, password } = body;

    validate.required(email, 'Email');
    validate.required(password, 'Password');

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
    const userProfile = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: {
        ':email': `EMAIL#${email}`,
      },
    });

    if (!userProfile || userProfile.length === 0) {
      return response.error('User profile not found', 404);
    }

    const profile = userProfile[0];

    return response.success({
      message: 'Login successful',
      tokens: {
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
      },
      user: {
        userId: profile.userId,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
      },
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'NotAuthorizedException' || error.name === 'UserNotConfirmedException') {
      return response.error('Invalid credentials or user not confirmed', 401);
    }
    
    return response.error('Login failed', 400, error.message);
  }
}

async function handleConfirmSignUp(body: any): Promise<APIGatewayProxyResult> {
  try {
    const { email, confirmationCode } = body;

    validate.required(email, 'Email');
    validate.required(confirmationCode, 'Confirmation code');

    // This would be used if email verification is enabled
    // For now, we auto-confirm users during registration
    
    return response.success({
      message: 'User confirmed successfully',
    });

  } catch (error: any) {
    console.error('Confirm signup error:', error);
    return response.error('Confirmation failed', 400, error.message);
  }
}
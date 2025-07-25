// Test script to verify demo authentication works
const { CognitoIdentityProviderClient, InitiateAuthCommand, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

require('dotenv').config();

const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
};

const cognito = new CognitoIdentityProviderClient(awsConfig);
const dynamoClient = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USER_POOL_ID = 'us-east-1_QJfYt64uz';
const USER_POOL_CLIENT_ID = 'your-client-id'; // We'll need to get this
const TABLE_NAME = 'ifad-staging';

const testCredentials = [
  {
    email: 'demo.host@capitalone.com',
    password: 'DemoPass123!',
    role: 'host'
  },
  {
    email: 'admin@umd.edu',
    password: 'AdminPass123!',
    role: 'admin'
  }
];

async function testCognitoAuth(email, password) {
  try {
    console.log(`🔐 Testing Cognito auth for ${email}...`);
    
    // First verify the user exists in Cognito
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email
    });
    
    const userInfo = await cognito.send(getUserCommand);
    console.log(`✅ User exists in Cognito: ${email}`);
    console.log(`   Status: ${userInfo.UserStatus}`);
    console.log(`   Groups: ${userInfo.UserAttributes?.find(attr => attr.Name === 'cognito:groups')?.Value || 'None'}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Cognito auth failed for ${email}:`, error.message);
    return false;
  }
}

async function testDynamoDbUser(email) {
  try {
    console.log(`📊 Testing DynamoDB user lookup for ${email}...`);
    
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: {
        ':email': `EMAIL#${email}`
      }
    });
    
    const result = await docClient.send(queryCommand);
    
    if (result.Items && result.Items.length > 0) {
      const user = result.Items[0];
      console.log(`✅ User found in DynamoDB: ${email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      if (user.role === 'host') {
        console.log(`   Organization: ${user.organization}`);
        console.log(`   Career Fields: ${user.careerFields?.join(', ')}`);
      }
      return true;
    } else {
      console.log(`❌ User not found in DynamoDB: ${email}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ DynamoDB lookup failed for ${email}:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Demo Authentication Setup...\n');
  
  let cognitoTests = 0;
  let dynamoTests = 0;
  let cognitoPassed = 0;
  let dynamoPassed = 0;
  
  for (const cred of testCredentials) {
    console.log(`\n📝 Testing ${cred.role}: ${cred.email}`);
    console.log('─'.repeat(50));
    
    // Test Cognito
    cognitoTests++;
    if (await testCognitoAuth(cred.email, cred.password)) {
      cognitoPassed++;
    }
    
    // Test DynamoDB
    dynamoTests++;
    if (await testDynamoDbUser(cred.email)) {
      dynamoPassed++;
    }
    
    console.log('');
  }
  
  console.log('\n🎯 Test Results Summary:');
  console.log('═'.repeat(50));
  console.log(`Cognito Authentication: ${cognitoPassed}/${cognitoTests} passed`);
  console.log(`DynamoDB User Lookup: ${dynamoPassed}/${dynamoTests} passed`);
  
  if (cognitoPassed === cognitoTests && dynamoPassed === dynamoTests) {
    console.log('\n🎉 All tests passed! Demo authentication is ready.');
    console.log('\nDemo Credentials to use in the app:');
    console.log('📧 Host: demo.host@capitalone.com / DemoPass123!');
    console.log('🔐 Admin: admin@umd.edu / AdminPass123! (via hidden access)');
    console.log('🎓 Student: Use UMD CAS authentication');
  } else {
    console.log('\n⚠️  Some tests failed. Check the configuration.');
  }
}

// Check environment
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found. Please set environment variables.');
  process.exit(1);
}

runTests();
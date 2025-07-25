// Demo data seeding script for IFAD Portal
const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

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

const USER_POOL_ID = 'us-east-1_QJfYt64uz'; // Actual user pool ID from deployment
const TABLE_NAME = 'ifad-staging'; // Table name from deployment

const demoUsers = [
  {
    role: 'host',
    email: 'demo.host@capitalone.com',
    password: 'DemoPass123!',
    firstName: 'Demo',
    lastName: 'Host',
    workEmail: 'demo.host@capitalone.com',
    preferredPhone: '(555) 123-4567',
    organization: 'Capital One',
    jobTitle: 'Senior Software Engineer',
    companyWebsite: 'https://www.capitalone.com',
    companyAddress: '1680 Capital One Drive',
    cityState: 'McLean, VA',
    zipCode: '22102',
    careerFields: ['Computing/Computer Science and Technology', 'Business'],
    opportunityType: 'in-person',
    isDcMetroAccessible: true,
    isPhysicalOffice: true,
    isFederalAgency: false,
    requiresCitizenship: false,
    requiresBackgroundCheck: false,
    organizationDescription: 'Capital One is a leading digital bank that is transforming the banking industry through technology, data, and design. We are building a best-in-class engineering organization.',
    experienceDescription: 'Students will shadow a software engineer and participate in team meetings, code reviews, and project planning sessions. They will learn about fintech, cloud computing, and agile development practices.',
    maxStudents: 2,
    availableDays: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri'],
    availableWinterSession: true,
    interestedInRecruitment: true,
    sharedIdentities: ['First Generation College Student (former)'],
    previousHostExperience: false,
    isUmdParent: false,
    isUmdAlumni: true
  },
  {
    role: 'admin',
    email: 'admin@umd.edu',
    password: 'AdminPass123!',
    firstName: 'System',
    lastName: 'Administrator',
    permissions: ['user_management', 'host_approval', 'system_settings', 'reports']
  },
  {
    role: 'student',
    email: 'testudent@umd.edu', // This will be for CAS demo
    firstName: 'Test',
    lastName: 'Student',
    directoryId: 'testudent',
    username: 'testudent',
    major: 'Computer Science',
    graduationYear: 2025,
    orientationCompleted: false,
    applicationSubmitted: false,
    matched: false,
    authMethod: 'cas'
  }
];

async function createCognitoUser(userData) {
  try {
    console.log(`Creating Cognito user: ${userData.email}`);
    
    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: userData.email,
      UserAttributes: [
        { Name: 'email', Value: userData.email },
        { Name: 'given_name', Value: userData.firstName },
        { Name: 'family_name', Value: userData.lastName },
        { Name: 'email_verified', Value: 'true' }
      ],
      MessageAction: 'SUPPRESS', // Don't send welcome email
      TemporaryPassword: userData.password
    });
    
    await cognito.send(createUserCommand);
    console.log(`✅ Cognito user created: ${userData.email}`);
    
    // Set permanent password
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: userData.email,
      Password: userData.password,
      Permanent: true
    });
    
    await cognito.send(setPasswordCommand);
    console.log(`✅ Password set for: ${userData.email}`);
    
    // Add user to appropriate group
    if (userData.role !== 'student') { // Students don't use Cognito groups
      const addToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: userData.email,
        GroupName: userData.role
      });
      
      await cognito.send(addToGroupCommand);
      console.log(`✅ Added to ${userData.role} group: ${userData.email}`);
    }
    
  } catch (error) {
    if (error.name === 'UsernameExistsException') {
      console.log(`⚠️  User already exists in Cognito: ${userData.email}`);
    } else {
      console.error(`❌ Error creating Cognito user ${userData.email}:`, error.message);
      throw error;
    }
  }
}

async function createDynamoUser(userData) {
  try {
    const userId = uuidv4();
    console.log(`Creating DynamoDB user: ${userData.email}`);
    
    const dynamoItem = {
      PK: `USER#${userId}`,
      SK: 'PROFILE',
      GSI1PK: userData.role === 'student' ? `DIRECTORY_ID#${userData.directoryId}` : `EMAIL#${userData.email}`,
      GSI1SK: `USER#${userId}`,
      GSI2PK: `ROLE#${userData.role}`,
      GSI2SK: `USER#${userId}`,
      
      // User data
      userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Add all additional fields for the user
      ...userData
    };
    
    // Add special fields for hosts
    if (userData.role === 'host') {
      dynamoItem.GSI3PK = `OPPORTUNITY#${userData.opportunityType}`;
      dynamoItem.GSI3SK = `USER#${userId}`;
      dynamoItem.careerFieldsSearch = userData.careerFields?.join('|') || '';
      dynamoItem.locationSearch = `${userData.cityState}|${userData.zipCode}`;
      dynamoItem.availabilitySearch = userData.availableDays?.join('|') || '';
      
      // Legacy fields for compatibility
      dynamoItem.industry = userData.careerFields?.[0] || 'Other';
      dynamoItem.bio = userData.organizationDescription;
      dynamoItem.experienceType = userData.opportunityType === 'in-person' ? 'shadowing' : 'interview';
      dynamoItem.location = userData.opportunityType;
      dynamoItem.verified = false;
      dynamoItem.matchedStudentIds = [];
    }
    
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: dynamoItem
    });
    
    await docClient.send(putCommand);
    console.log(`✅ DynamoDB user created: ${userData.email}`);
    
  } catch (error) {
    console.error(`❌ Error creating DynamoDB user ${userData.email}:`, error.message);
    throw error;
  }
}

async function seedDemoData() {
  console.log('🌱 Starting demo data seeding...\n');
  
  try {
    for (const userData of demoUsers) {
      console.log(`\n📝 Processing ${userData.role}: ${userData.email}`);
      
      // Create in Cognito (except for CAS students)
      if (userData.role !== 'student') {
        await createCognitoUser(userData);
      }
      
      // Create in DynamoDB
      await createDynamoUser(userData);
      
      console.log(`✅ Completed: ${userData.email}\n`);
    }
    
    console.log('🎉 Demo data seeding completed successfully!\n');
    console.log('Demo Accounts Created:');
    console.log('📧 Host: demo.host@capitalone.com / DemoPass123!');
    console.log('🔐 Admin: admin@umd.edu / AdminPass123!');
    console.log('🎓 Student: testudent@umd.edu (CAS only)');
    console.log('\nNote: Student accounts use UMD CAS authentication');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Check if environment variables are set
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
  process.exit(1);
}

// Run the seeding
seedDemoData();
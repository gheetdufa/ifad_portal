import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export interface IfadStackProps extends cdk.StackProps {
  stage: 'staging' | 'prod';
}

export class IfadStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly api: apigateway.RestApi;
  public readonly dynamoTable: dynamodb.Table;
  private lambdaFunctions: { [key: string]: nodejs.NodejsFunction } = {};
  
  constructor(scope: Construct, id: string, props: IfadStackProps) {
    super(scope, id, props);

    // DynamoDB Table - Single table design
    this.dynamoTable = new dynamodb.Table(this, 'IfadTable', {
      tableName: `ifad-${props.stage}`,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: props.stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: props.stage === 'prod',
    });

    // Global Secondary Indexes
    this.dynamoTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
    });

    this.dynamoTable.addGlobalSecondaryIndex({
      indexName: 'GSI2',
      partitionKey: { name: 'GSI2PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI2SK', type: dynamodb.AttributeType.STRING },
    });

    // Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'IfadUserPool', {
      userPoolName: `ifad-users-${props.stage}`,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: props.stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // Cognito User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, 'IfadUserPoolClient', {
      userPool: this.userPool,
      generateSecret: false,
      authFlows: {
        userSrp: true,
        userPassword: false,
        adminUserPassword: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.PROFILE],
      },
    });

    // Cognito Groups for role-based access
    new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admin',
      description: 'Admin users with full access',
    });

    new cognito.CfnUserPoolGroup(this, 'HostGroup', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'host',
      description: 'Host users who provide experiences',
    });

    new cognito.CfnUserPoolGroup(this, 'StudentGroup', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'student',
      description: 'Student users seeking experiences',
    });

    // S3 Bucket for file storage
    const filesBucket = new s3.Bucket(this, 'IfadFilesBucket', {
      bucketName: `ifad-files-${props.stage}-${this.account}`,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
      removalPolicy: props.stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: props.stage !== 'prod',
    });

    // Lambda Layer for shared utilities
    const sharedLayer = new lambda.LayerVersion(this, 'SharedLayer', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/layers/shared')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      description: 'Shared utilities for IFAD Lambda functions',
    });

    // Lambda execution role
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query',
                'dynamodb:Scan',
              ],
              resources: [
                this.dynamoTable.tableArn,
                `${this.dynamoTable.tableArn}/index/*`,
              ],
            }),
          ],
        }),
        CognitoAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'cognito-idp:AdminGetUser',
                'cognito-idp:AdminUpdateUserAttributes',
                'cognito-idp:AdminAddUserToGroup',
                'cognito-idp:AdminRemoveUserFromGroup',
                'cognito-idp:ListUsersInGroup',
              ],
              resources: [this.userPool.userPoolArn],
            }),
          ],
        }),
        S3Access: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
              resources: [`${filesBucket.bucketArn}/*`],
            }),
          ],
        }),
      },
    });

    // API Gateway
    this.api = new apigateway.RestApi(this, 'IfadApi', {
      restApiName: `ifad-api-${props.stage}`,
      description: `IFAD Portal API - ${props.stage}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Cognito Authorizer
    const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      cognitoUserPools: [this.userPool],
    });

    // Lambda functions will be created in separate methods
    this.createLambdaFunctions(lambdaExecutionRole, sharedLayer, props.stage);
    
    // API routes will be created after lambda functions
    this.createApiRoutes(cognitoAuthorizer);

    // Outputs
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: filesBucket.bucketName,
      description: 'S3 Bucket Name',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: this.dynamoTable.tableName,
      description: 'DynamoDB Table Name',
    });
  }

  private createLambdaFunctions(role: iam.Role, layer: lambda.LayerVersion, stage: string) {
    const environment = {
      TABLE_NAME: this.dynamoTable.tableName,
      USER_POOL_ID: this.userPool.userPoolId,
      USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
      STAGE: stage,
    };

    // Auth functions
    this.lambdaFunctions.auth = this.createFunction('AuthHandler', 'auth', role, layer, environment);
    
    // User management functions
    this.lambdaFunctions.users = this.createFunction('UserHandler', 'users', role, layer, environment);
    
    // Application functions
    this.lambdaFunctions.applications = this.createFunction('ApplicationHandler', 'applications', role, layer, environment);
    
    // Admin functions
    this.lambdaFunctions.admin = this.createFunction('AdminHandler', 'admin', role, layer, environment);
    
    // Public functions
    this.lambdaFunctions.public = this.createFunction('PublicHandler', 'public', role, layer, environment);
  }

  private createFunction(
    functionName: string,
    handlerPath: string,
    role: iam.Role,
    layer: lambda.LayerVersion,
    environment: Record<string, string>
  ): nodejs.NodejsFunction {
    return new nodejs.NodejsFunction(this, functionName, {
      entry: path.join(__dirname, `../lambda/functions/${handlerPath}/index.ts`),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      role,
      layers: [layer],
      environment,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });
  }

  private createApiRoutes(authorizer: apigateway.CognitoUserPoolsAuthorizer) {
    // Auth routes (no auth required)
    const authResource = this.api.root.addResource('auth');
    const loginResource = authResource.addResource('login');
    const registerResource = authResource.addResource('register');
    const confirmResource = authResource.addResource('confirm');
    
    loginResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));
    registerResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));
    confirmResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));
    
    // Protected routes (auth required)
    const usersResource = this.api.root.addResource('users');
    const profileResource = usersResource.addResource('profile');
    const searchResource = usersResource.addResource('search');
    const hostsResource = usersResource.addResource('hosts');
    const userIdResource = usersResource.addResource('{userId}');
    
    profileResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users), {
      authorizer,
    });
    profileResource.addMethod('PUT', new apigateway.LambdaIntegration(this.lambdaFunctions.users), {
      authorizer,
    });
    searchResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users), {
      authorizer,
    });
    hostsResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users), {
      authorizer,
    });
    userIdResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users), {
      authorizer,
    });
    
    // Applications routes
    const applicationsResource = this.api.root.addResource('applications');
    const applicationIdResource = applicationsResource.addResource('{applicationId}');
    const reviewResource = applicationIdResource.addResource('review');
    const matchResource = applicationIdResource.addResource('match');
    
    applicationsResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.applications), {
      authorizer,
    });
    applicationsResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.applications), {
      authorizer,
    });
    applicationIdResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.applications), {
      authorizer,
    });
    applicationIdResource.addMethod('PUT', new apigateway.LambdaIntegration(this.lambdaFunctions.applications), {
      authorizer,
    });
    reviewResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.applications), {
      authorizer,
    });
    matchResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.applications), {
      authorizer,
    });
    
    // Admin routes
    const adminResource = this.api.root.addResource('admin');
    const settingsResource = adminResource.addResource('settings');
    const statsResource = adminResource.addResource('stats');
    const adminUsersResource = adminResource.addResource('users');
    const adminUserIdResource = adminUsersResource.addResource('{userId}');
    const adminApplicationsResource = adminResource.addResource('applications');
    const matchesResource = adminResource.addResource('matches');
    const exportResource = adminResource.addResource('export');
    const bulkImportResource = adminResource.addResource('bulk-import');
    
    settingsResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    settingsResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    statsResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    adminUsersResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    adminUserIdResource.addMethod('PUT', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    adminUserIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    adminApplicationsResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    matchesResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    exportResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    bulkImportResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.admin), {
      authorizer,
    });
    
    // Public routes (no auth required)
    const publicResource = this.api.root.addResource('public');
    const publicHostsResource = publicResource.addResource('hosts');
    const publicStatsResource = publicResource.addResource('stats');
    const healthResource = publicResource.addResource('health');
    
    publicHostsResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.public));
    publicStatsResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.public));
    healthResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.public));
  }
}
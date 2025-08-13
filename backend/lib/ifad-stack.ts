import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
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
  public readonly websiteBucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
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
      pointInTimeRecoverySpecification: props.stage === 'prod'
        ? { pointInTimeRecoveryEnabled: true }
        : { pointInTimeRecoveryEnabled: false },
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
        userPassword: true,
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

    // S3 Bucket for Website Hosting
    this.websiteBucket = new s3.Bucket(this, 'IfadWebsiteBucket', {
      bucketName: `ifad-website-${props.stage}-${this.account}`,
      publicReadAccess: false, // CloudFront will handle access
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: props.stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: props.stage !== 'prod',
    });

    // Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'IfadOAI', {
      comment: `OAI for IFAD Portal ${props.stage}`,
    });

    // Grant CloudFront access to the S3 bucket
    this.websiteBucket.grantRead(originAccessIdentity);

    // CloudFront Distribution for Website
    this.distribution = new cloudfront.Distribution(this, 'IfadWebsiteDistribution', {
      defaultBehavior: {
        // Use S3Origin for now to avoid breaking API; consider upgrading to S3BucketOrigin when available
        origin: new origins.S3Origin(this.websiteBucket, { originAccessIdentity }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // US, Canada, Europe
      comment: `IFAD Portal ${props.stage} Website Distribution`,
    });

    // Deploy website files to S3 (uncomment this when you want to deploy)
    // new s3deploy.BucketDeployment(this, 'IfadWebsiteDeployment', {
    //   sources: [s3deploy.Source.asset('../dist')],
    //   destinationBucket: this.websiteBucket,
    //   distribution: this.distribution,
    //   distributionPaths: ['/*'],
    // });

    // No lambda layer needed - utilities are bundled directly

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
        SESAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'ses:SendEmail',
                'ses:SendRawEmail',
              ],
              resources: ['*'],
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
                'cognito-idp:AdminConfirmSignUp',
                'cognito-idp:AdminCreateUser',
                'cognito-idp:AdminSetUserPassword',
                'cognito-idp:ListUsersInGroup',
                'cognito-idp:SignUp',
                'cognito-idp:InitiateAuth',
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

    // Lambda functions will be created in separate methods
    this.createLambdaFunctions(lambdaExecutionRole, props.stage);
    
    // API routes will be created after lambda functions
    this.createApiRoutes();

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

    new cdk.CfnOutput(this, 'WebsiteBucketName', {
      value: this.websiteBucket.bucketName,
      description: 'S3 Website Bucket Name',
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront Distribution ID',
    });

    new cdk.CfnOutput(this, 'CloudFrontDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${this.distribution.distributionDomainName}`,
      description: 'Website URL',
    });
  }

  private createLambdaFunctions(role: iam.Role, stage: string) {
    const environment = {
      TABLE_NAME: this.dynamoTable.tableName,
      USER_POOL_ID: this.userPool.userPoolId,
      USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
      STAGE: stage,
      FROM_EMAIL: `no-reply@${cdk.Aws.ACCOUNT_ID}.example.com`,
    };

    // Auth functions
    this.lambdaFunctions.auth = this.createFunction('AuthHandler', 'auth', role, environment);
    // Core application functions
    this.lambdaFunctions.users = this.createFunction('UserHandler', 'users', role, environment);
    this.lambdaFunctions.applications = this.createFunction('ApplicationHandler', 'applications', role, environment);
    this.lambdaFunctions.admin = this.createFunction('AdminHandler', 'admin', role, environment);
    this.lambdaFunctions.public = this.createFunction('PublicHandler', 'public', role, environment);
  }

  private createFunction(
    functionName: string,
    handlerPath: string,
    role: iam.Role,
    environment: Record<string, string>
  ): nodejs.NodejsFunction {
    return new nodejs.NodejsFunction(this, functionName, {
      entry: path.join(__dirname, `../lambda/functions/${handlerPath}/index.ts`),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      role,
      environment,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });
  }

  private createApiRoutes() {
    // Auth routes (no auth required)
    const authResource = this.api.root.addResource('auth');
    const loginResource = authResource.addResource('login');
    const registerResource = authResource.addResource('register');
    const confirmResource = authResource.addResource('confirm');
    const forgotResource = authResource.addResource('forgot');
    const resetResource = authResource.addResource('reset');
    
    loginResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));
    registerResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));
    confirmResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));
    forgotResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));
    resetResource.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.auth));

    // Public routes
    const publicResource = this.api.root.addResource('public');
    publicResource.addResource('hosts').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.public));
    publicResource.addResource('stats').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.public));
    publicResource.addResource('health').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.public));

    // Users routes (auth required at function level)
    const usersResource = this.api.root.addResource('users');
    const profileRes = usersResource.addResource('profile');
    profileRes.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users));
    profileRes.addMethod('PUT', new apigateway.LambdaIntegration(this.lambdaFunctions.users));
    usersResource.addResource('search').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users));
    usersResource.addResource('hosts').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users));
    const userIdRes = usersResource.addResource('{userId}');
    userIdRes.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users));

    const semesterReg = usersResource.addResource('semester-registration');
    semesterReg.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.users));
    semesterReg.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.users));
    semesterReg.addMethod('PUT', new apigateway.LambdaIntegration(this.lambdaFunctions.users));

    // Applications route (placeholder)
    this.api.root.addResource('applications').addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.applications));

    // Admin routes (auth + admin check in function)
    const adminResource = this.api.root.addResource('admin');
    const settingsRes = adminResource.addResource('settings');
    settingsRes.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    settingsRes.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    adminResource.addResource('stats').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    // Admin semester endpoints (CORS covered by RestApi default)
    const semesterRes = adminResource.addResource('semester');
    semesterRes.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    semesterRes.addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    const adminUsersResource = adminResource.addResource('users');
    adminUsersResource.addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    const adminUserIdRes = adminUsersResource.addResource('{userId}');
    adminUserIdRes.addMethod('PUT', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    adminUserIdRes.addMethod('DELETE', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    adminResource.addResource('applications').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    adminResource.addResource('matches').addMethod('GET', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    adminResource.addResource('export').addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
    adminResource.addResource('bulk-import').addMethod('POST', new apigateway.LambdaIntegration(this.lambdaFunctions.admin));
  }
}
# IFAD Portal Backend

AWS serverless backend for the University of Maryland IFAD (Intern For A Day) Portal.

## Quick Deployment

```bash
# Deploy to staging
./deploy.sh

# Deploy to production  
./deploy.sh -s prod
```

## Architecture

- **AWS Cognito**: Authentication with role-based groups (student/host/admin)
- **DynamoDB**: Single-table NoSQL database 
- **Lambda**: Serverless API functions
- **API Gateway**: REST API with Cognito authorization
- **S3**: File storage

## Prerequisites

- Node.js 18+
- AWS CLI configured
- CDK CLI: `npm install -g aws-cdk`

## API Endpoints

### Public (No Auth)
- `GET /public/hosts` - List hosts
- `GET /public/health` - Health check

### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login

### Users (Auth Required)
- `GET /users/profile` - Get profile
- `PUT /users/profile` - Update profile
- `GET /users/hosts` - List hosts

### Applications (Auth Required)  
- `GET /applications` - List applications
- `POST /applications` - Submit application
- `POST /applications/{id}/review` - Review (host/admin)

### Admin (Admin Only)
- `GET /admin/settings` - System settings
- `POST /admin/settings` - Update settings
- `GET /admin/stats` - Statistics
- `GET /admin/users` - User management

## User Roles

- **Students**: Register, apply, view hosts
- **Hosts**: Register, review applications  
- **Admins**: Full system access

## Development

```bash
npm install
npm run build
cdk synth --context stage=staging
```

See deployment script outputs for API URLs and Cognito details after deployment.
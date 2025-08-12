#!/bin/bash

# IFAD Portal Local Deployment Script
# Uses credentials from .env file

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}IFAD Portal Local Deployment${NC}"
echo -e "${BLUE}=============================${NC}"

# Load environment variables from .env file
if [ -f .env ]; then
    echo -e "${BLUE}Loading environment variables from .env...${NC}"
    export $(cat .env | xargs)
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
    echo -e "${RED}Error: .env file not found${NC}"
    exit 1
fi

# Verify required environment variables
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_REGION" ]; then
    echo -e "${RED}Error: Missing required AWS credentials in .env file${NC}"
    exit 1
fi

echo -e "Region: ${YELLOW}$AWS_REGION${NC}"
echo -e "Stage: ${YELLOW}${STAGE:-staging}${NC}"
echo ""

# Check if local CDK is available
if [ -f "node_modules/.bin/cdk" ]; then
    CDK_CMD="./node_modules/.bin/cdk"
    echo -e "${GREEN}✓ Using local CDK${NC}"
else
    echo -e "${YELLOW}Installing AWS CDK locally...${NC}"
    npm install aws-cdk
    CDK_CMD="./node_modules/.bin/cdk"
fi

# Build the project
echo -e "${BLUE}Building project...${NC}"
if ! npm run build; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build completed${NC}"

# Install Lambda layer dependencies
echo -e "${BLUE}Installing Lambda layer dependencies...${NC}"
cd lambda/layers/shared/nodejs
if ! npm install --production; then
    echo -e "${RED}Error: Failed to install Lambda layer dependencies${NC}"
    exit 1
fi
cd ../../../..
echo -e "${GREEN}✓ Lambda layer dependencies installed${NC}"

# Bootstrap CDK if needed
echo -e "${BLUE}Checking CDK bootstrap status...${NC}"
STAGE=${STAGE:-staging}
if ! $CDK_CMD bootstrap --context stage=$STAGE 2>/dev/null; then
    echo -e "${YELLOW}CDK not bootstrapped, bootstrapping now...${NC}"
    if ! $CDK_CMD bootstrap --context stage=$STAGE; then
        echo -e "${RED}Error: CDK bootstrap failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ CDK bootstrap completed${NC}"
else
    echo -e "${GREEN}✓ CDK already bootstrapped${NC}"
fi

# Deploy the stack
echo -e "${BLUE}Deploying IFAD Portal to $STAGE environment...${NC}"
if ! $CDK_CMD deploy --context stage=$STAGE --require-approval never; then
    echo -e "${RED}Error: Deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""

# Get stack outputs using AWS CLI (if available) or manual instructions
echo -e "${BLUE}Getting stack outputs...${NC}"
STACK_NAME="ifad-portal-$STAGE"

# Try to get outputs and extract API URL
if command -v aws &> /dev/null; then
    echo -e "${GREEN}Stack Outputs:${NC}"
    aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs' --output table 2>/dev/null || {
        echo -e "${YELLOW}Could not retrieve stack outputs automatically.${NC}"
        echo -e "${YELLOW}Please check AWS CloudFormation console for the API Gateway URL.${NC}"
    }
else
    echo -e "${YELLOW}AWS CLI not available. Please check AWS CloudFormation console for outputs.${NC}"
fi

echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo -e "1. Copy the ApiEndpoint URL from the stack outputs above"
echo -e "2. Update your frontend .env file with: VITE_API_URL=<ApiEndpoint>"
echo -e "3. The API URL should look like: https://abc123.execute-api.us-east-1.amazonaws.com/api"
echo ""
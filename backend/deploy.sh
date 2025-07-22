#!/bin/bash

# IFAD Portal AWS Deployment Script
# This script deploys the IFAD portal infrastructure to AWS using CDK

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
STAGE="staging"
AWS_PROFILE=""
SKIP_BUILD=false

# Function to display usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -s, --stage <stage>       Deploy to specific stage (staging|prod) [default: staging]"
    echo "  -p, --profile <profile>   AWS profile to use"
    echo "  --skip-build             Skip npm build step"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       Deploy to staging with default profile"
    echo "  $0 -s prod              Deploy to production"
    echo "  $0 -p my-aws-profile    Deploy using specific AWS profile"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--stage)
            STAGE="$2"
            shift 2
            ;;
        -p|--profile)
            AWS_PROFILE="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# Validate stage
if [[ "$STAGE" != "staging" && "$STAGE" != "prod" ]]; then
    echo -e "${RED}Error: Stage must be either 'staging' or 'prod'${NC}"
    exit 1
fi

# Set AWS profile if specified
if [[ -n "$AWS_PROFILE" ]]; then
    export AWS_PROFILE="$AWS_PROFILE"
    echo -e "${BLUE}Using AWS Profile: $AWS_PROFILE${NC}"
fi

echo -e "${BLUE}IFAD Portal Deployment${NC}"
echo -e "${BLUE}======================${NC}"
echo -e "Stage: ${YELLOW}$STAGE${NC}"
echo -e "AWS Profile: ${YELLOW}${AWS_PROFILE:-default}${NC}"
echo ""

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo -e "${RED}Error: AWS CDK CLI is not installed. Install it with: npm install -g aws-cdk${NC}"
    exit 1
fi

# Check AWS credentials
echo -e "${BLUE}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}Error: AWS credentials not configured or invalid${NC}"
    echo -e "${YELLOW}Please configure your AWS credentials using 'aws configure' or set environment variables${NC}"
    exit 1
fi

# Get AWS account and region info
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region || echo "us-east-1")

echo -e "${GREEN}✓ AWS credentials verified${NC}"
echo -e "  Account: $AWS_ACCOUNT"
echo -e "  Region: $AWS_REGION"
echo ""

# Build the project
if [[ "$SKIP_BUILD" == "false" ]]; then
    echo -e "${BLUE}Building project...${NC}"
    if ! npm run build; then
        echo -e "${RED}Error: Build failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Build completed${NC}"
    echo ""
fi

# Install Lambda layer dependencies
echo -e "${BLUE}Installing Lambda layer dependencies...${NC}"
cd lambda/layers/shared/nodejs
if ! npm install --production; then
    echo -e "${RED}Error: Failed to install Lambda layer dependencies${NC}"
    exit 1
fi
cd ../../../..
echo -e "${GREEN}✓ Lambda layer dependencies installed${NC}"
echo ""

# Bootstrap CDK if needed
echo -e "${BLUE}Checking CDK bootstrap status...${NC}"
if ! cdk bootstrap --context stage=$STAGE 2>/dev/null; then
    echo -e "${YELLOW}CDK not bootstrapped for this account/region, bootstrapping now...${NC}"
    if ! cdk bootstrap --context stage=$STAGE; then
        echo -e "${RED}Error: CDK bootstrap failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ CDK bootstrap completed${NC}"
else
    echo -e "${GREEN}✓ CDK already bootstrapped${NC}"
fi
echo ""

# Deploy the stack
echo -e "${BLUE}Deploying IFAD Portal to $STAGE environment...${NC}"
if ! cdk deploy --context stage=$STAGE --require-approval never; then
    echo -e "${RED}Error: Deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""

# Get stack outputs
echo -e "${BLUE}Retrieving stack outputs...${NC}"
STACK_NAME="ifad-portal-$STAGE"

# Try to get the outputs
OUTPUTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs' --output json 2>/dev/null || echo "[]")

if [[ "$OUTPUTS" != "[]" ]]; then
    echo -e "${GREEN}Stack Outputs:${NC}"
    echo "$OUTPUTS" | jq -r '.[] | "  \(.OutputKey): \(.OutputValue)"' 2>/dev/null || echo "$OUTPUTS"
else
    echo -e "${YELLOW}No stack outputs available yet.${NC}"
fi

echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo -e "1. Update your frontend configuration with the API URL and Cognito details"
echo -e "2. Test the API endpoints using the health check: GET /public/health"
echo -e "3. Create your first admin user through the Cognito console"
echo ""

if [[ "$STAGE" == "staging" ]]; then
    echo -e "${YELLOW}Remember: This is the STAGING environment for testing.${NC}"
    echo -e "${YELLOW}Deploy to production with: $0 -s prod${NC}"
fi
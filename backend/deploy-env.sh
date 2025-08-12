#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    set -a  # automatically export all variables
    source .env
    set +a  # stop automatically exporting
    echo "✓ Environment variables loaded from .env"
    echo "AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID:0:10}..."
    echo "AWS_REGION: $AWS_REGION"
else
    echo "✗ .env file not found"
    exit 1
fi

# Run the deployment
npm run deploy:staging
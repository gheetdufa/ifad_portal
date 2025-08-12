#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "✓ Environment variables loaded from .env"
else
    echo "✗ .env file not found"
    exit 1
fi

# Run the deployment
npm run deploy:staging
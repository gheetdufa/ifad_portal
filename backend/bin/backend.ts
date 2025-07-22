#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IfadStack } from '../lib/ifad-stack';

const app = new cdk.App();

// Get stage from context or default to staging
const stage = app.node.tryGetContext('stage') || 'staging';

if (!['staging', 'prod'].includes(stage)) {
  throw new Error('Stage must be either "staging" or "prod"');
}

new IfadStack(app, `IfadStack-${stage}`, {
  stage: stage as 'staging' | 'prod',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  stackName: `ifad-portal-${stage}`,
  description: `IFAD Portal Infrastructure - ${stage} environment`,
  tags: {
    Project: 'IFAD-Portal',
    Environment: stage,
    Owner: 'UMD-IFAD',
  },
});
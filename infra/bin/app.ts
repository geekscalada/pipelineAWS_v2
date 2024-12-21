#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack.js';
import { LambdaStack } from '../lib/lambda-stack.js';

import * as dotenv from 'dotenv';
dotenv.config();

/**
 * This is the entry point of the CDK application.
 */
const app = new cdk.App();

/**
 * Pipeline stacks
 */
new PipelineStack(app, 'PipelineStack-Dev', {
  env: {
    account: process.env.DEV_ENV_ACCOUNT,
    region: process.env.DEV_ENV_REGION,
  },
  githubOwner: process.env.DEV_ENV_GITHUB_OWNER as string,
  githubRepo: process.env.DEV_ENV_GITHUB_REPO as string,
  githubBranch: process.env.DEV_ENV_GITHUB_BRANCH as string,
  environmentName: process.env.DEV_ENV_NAME as string,
});

new PipelineStack(app, 'PipelineStack-Pre', {
  env: {
    account: process.env.PRE_ENV_ACCOUNT,
    region: process.env.PRE_ENV_REGION,
  },
  githubOwner: process.env.PRE_ENV_GITHUB_OWNER as string,
  githubRepo: process.env.PRE_ENV_GITHUB_REPO as string,
  githubBranch: process.env.PRE_ENV_GITHUB_BRANCH as string,
  environmentName: process.env.PRE_ENV_NAME as string,
});

// // References to the class LambdaStack

// new LambdaStack(app, 'LambdaStack', {
//   env: {
//     account: process.env.CDK_DEFAULT_ACCOUNT,
//     region: process.env.CDK_DEFAULT_REGION,
//   },
// });

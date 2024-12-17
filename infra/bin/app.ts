#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack.js';
import { LambdaStack } from '../lib/lambda-stack.js';

/**
 * This is the entry point of the CDK application.
 */
const app = new cdk.App();

/**
 * Pipeline stack
 */
new PipelineStack(app, 'PipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// // References to the class LambdaStack

// new LambdaStack(app, 'LambdaStack', {
//   env: {
//     account: process.env.CDK_DEFAULT_ACCOUNT,
//     region: process.env.CDK_DEFAULT_REGION,
//   },
// });

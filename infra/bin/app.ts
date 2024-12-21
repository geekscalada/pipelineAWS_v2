#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack.js';
import { LambdaStack } from '../lib/lambda-stack.js';

/**
 * This is the entry point of the CDK application.
 */
const app = new cdk.App();

/**
 * Variables to define which environment to deploy
 */
const environment = app.node.tryGetContext('env');

if (!environment) {
  throw new Error('No se especificó un entorno. Usa --context env=<env_name> para definirlo.');
}

const environmentContext = app.node.tryGetContext(environment);

if (!environmentContext) {
  throw new Error(`No se encontró el contexto para el entorno: ${environment}`);
}

const { account, region, githubOwner, githubRepo, githubBranch, environmentName, projectName } =
  environmentContext;

if (!account || !region || !githubOwner || !githubRepo || !githubBranch || !environmentName) {
  throw new Error(`Faltan valores en el contexto para el entorno: ${environment}`);
}

/**
 * Pipeline stacks for different environments
 */

new PipelineStack(app, `PipelineStack-${environmentName}`, {
  env: {
    account,
    region,
  },
  githubOwner,
  githubRepo,
  githubBranch,
  environmentName,
  projectName,
});

// References to the class LambdaStack
// TODO: generate custom names!
new LambdaStack(app, `LambdaStack-${environmentName}`, {
  env: {
    account,
    region,
  },
});

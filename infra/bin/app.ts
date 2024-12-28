#!/usr/bin/env node

import { LambdaStack } from '../lib/lambda-stack.js';
import { App, StackProps } from 'aws-cdk-lib';

export interface EnvironmentProps extends StackProps {
  gitHubToken: string;
  account: string;
  region: string;
  githubRepo: string;
  githubOwner: string;
  githubBranch: string;
  projectName: string;
  environmentName: string;
}

const app = new App();

// Obtener el entorno desde la línea de comandos
const environmentContext = app.node.tryGetContext('env');

if (!environmentContext) {
  throw new Error(`Could not get the context from the command line`);
}
// Obtener los valores del contexto para el entorno especificado
const secretValues: EnvironmentProps = app.node.tryGetContext(environmentContext);

if (!secretValues) {
  throw new Error(`Not found values for the environment: ${environmentContext}`);
}

// Stacks
// new LambdaStack(app, `LambdaStack-prueba`, secretValues);

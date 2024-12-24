#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { PipelineStack } from '../lib/pipeline-stack.js';
import { LambdaStack } from '../lib/lambda-stack.js';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { SecretValueEntryFilterSensitiveLog } from '@aws-sdk/client-secrets-manager';

interface EnvironmentProps extends StackProps {
  gitHubToken: string;
  account: string;
  region: string;
  githubRepo: string;
  githubOwner: string;
  githubBranch: string;
  projectName: string;
  environmentName: string;
}

class SecretPipelineStack extends Stack {
  constructor(scope: App, id: string, props: EnvironmentProps) {
    super(scope, id, props);

    // Crear el secreto en AWS Secrets Manager
    new Secret(this, `SecretPipeline`, {
      secretName: `secret-pipeline`,
      secretObjectValue: {
        gitHubToken: cdk.SecretValue.unsafePlainText(props.gitHubToken),
        account: cdk.SecretValue.unsafePlainText(props.account),
        region: cdk.SecretValue.unsafePlainText(props.region),
        githubRepo: cdk.SecretValue.unsafePlainText(props.githubRepo),
        githubOwner: cdk.SecretValue.unsafePlainText(props.githubOwner),
        githubBranch: cdk.SecretValue.unsafePlainText(props.githubBranch),
        projectName: cdk.SecretValue.unsafePlainText(props.projectName),
        environmentName: cdk.SecretValue.unsafePlainText(props.environmentName),
      },
    });
  }
}

const app = new App();

// Obtener el entorno desde la línea de comandos
const environmentContext = app.node.tryGetContext('env');

if (environmentContext) {
  console.log('Using context from the command line to set the secret in the account');

  // Obtener los valores del contexto para el entorno especificado
  const secretValues: EnvironmentProps = app.node.tryGetContext(environmentContext);

  if (!secretValues) {
    throw new Error(`No se encontraron valores de contexto para el entorno: ${environmentContext}`);
  }

  new SecretPipelineStack(app, `SecretPipelineStack`, secretValues);

  new PipelineStack(app, `PipelineStack`, {
    environmentName: secretValues.environmentName,
    projectName: secretValues.projectName,
    githubOwner: secretValues.githubOwner,
    githubRepo: secretValues.githubRepo,
    githubBranch: secretValues.githubBranch,
  });
}

// Optionally deploy other stacks (e.g., LambdaStack)
new LambdaStack(app, `LambdaStack-prueba`);

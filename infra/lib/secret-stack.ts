import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class SecretsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const context = this.node.tryGetContext('env');
    const account = this.node.tryGetContext(`${context}.account`);
    const region = this.node.tryGetContext(`${context}.region`);
    const repo = this.node.tryGetContext(`${context}.repo`);
    const owner = this.node.tryGetContext(`${context}.owner`);
    const branch = this.node.tryGetContext(`${context}.branch`);

    if (!account || !region || !repo || !owner || !branch) {
      throw new Error(`Faltan valores en el contexto para el entorno: ${context}`);
    }

    const existingSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'ExistingSecret',
      `${context}-pipeline-secret`,
    );

    if (!existingSecret) {
      // Create a secret in Secrets Manager
      new secretsmanager.Secret(this, 'PipelineSecret', {
        secretName: `${context}-pipeline-secret`,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            GITHUB_OWNER: owner,
            GITHUB_REPO: repo,
            GITHUB_BRANCH: branch,
          }),
          generateStringKey: 'unused',
        },
      });
    } else {
      console.log(`El secreto para ${context} ya existe, no se sobrescribe.`);
    }
  }
}

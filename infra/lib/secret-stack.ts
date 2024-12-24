import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface SecretsStackProps extends cdk.StackProps {
  environmentName: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  projectName: string;
}

export class SecretsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecretsStackProps) {
    super(scope, id, props);

    const { environmentName, githubOwner, githubRepo, githubBranch, projectName } = props;

    // Define the secret name
    const secretName = `pipeline-secret`;

    // Attempt to load the existing secret
    let existingSecret;
    try {
      existingSecret = secretsmanager.Secret.fromSecretNameV2(this, 'ExistingSecret', secretName);

      // Attempt to retrieve values to verify the secret exists
      const secretValue = existingSecret.secretValueFromJson('GITHUB_OWNER').unsafeUnwrap();

      console.log(
        `El secreto ya existe para el entorno: ${environmentName} con los datos ${secretValue}`,
      );
    } catch (err) {
      console.warn(
        `Error al intentar cargar el secreto ${secretName}. Se creará un nuevo secreto para el entorno: ${environmentName}`,
      );
    }

    if (!existingSecret) {
      console.log(
        `No se encontró un secreto existente. Creando uno nuevo para el entorno: ${environmentName}`,
      );

      // Create a new secret if it doesn't exist
      new secretsmanager.Secret(this, 'PipelineSecret', {
        secretName,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            GITHUB_OWNER: githubOwner,
            GITHUB_REPO: githubRepo,
            GITHUB_BRANCH: githubBranch,
            ENVIRONMENT_NAME: environmentName,
            PROJECT_NAME: projectName,
          }),
          generateStringKey: 'unused',
        },
      });

      console.log(`Se creó el secreto para el entorno: ${environmentName}`);
    }
  }
}

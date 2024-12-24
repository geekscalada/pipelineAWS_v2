import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Obtén el secreto desde AWS Secrets Manager
    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'Secret-pipeline',
      'secret-pipeline', // Nombre del secreto en AWS Secrets Manager
    );

    // Nombre estático base para evitar errores de síntesis
    const lambdaBaseName = 'jep_HelloWorld_lambda';

    // Define Lambda 1
    const myLambda = new lambda.Function(this, `${lambdaBaseName}_Static`, {
      functionName: `${lambdaBaseName}_Static`, // Nombre estático
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('../lambdas/my-lambda/dist'),
      handler: 'index.handler',
    });

    // Define Lambda 2 con un nombre dinámico derivado del entorno (como variable de entorno)
    const myLambda2 = new lambda.Function(this, `${lambdaBaseName}_Dynamic`, {
      functionName: `${lambdaBaseName}_Dynamic`, // Usamos un identificador único pero manejable
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('../lambdas/my-lambda/dist'),
      handler: 'index.handler',
      environment: {
        ENVIRONMENT_NAME: secret.secretValueFromJson('environmentName').unsafeUnwrap(),
        PROJECT_NAME: secret.secretValueFromJson('projectName').unsafeUnwrap(),
      },
    });

    // Etiquetas adicionales para identificación
    myLambda2.node.addMetadata(
      'environment',
      secret.secretValueFromJson('environmentName').toString(),
    );
    myLambda2.node.addMetadata('project', secret.secretValueFromJson('projectName').toString());
  }
}

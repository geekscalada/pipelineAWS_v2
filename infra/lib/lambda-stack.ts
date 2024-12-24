import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * @lambdaName: When you are passing it to the constructor, it is really an ID, and when you are passing use it as a property, it is a name.
     */
    const lambdaName = 'jep_HelloWorld_lambda';
    const myLambda = new lambda.Function(this, lambdaName, {
      functionName: lambdaName,
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('../lambdas/my-lambda/dist'),
      handler: 'index.handler',
    });

    // Obtén el secreto desde AWS Secrets Manager
    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'Secret-pipeline',
      'secret-pipeline', // Nombre del secreto en AWS Secrets Manager
    );

    // Conforma el nombre dinámico de la Lambda
    const lambdaName2 = `jep_${secret
      .secretValueFromJson('projectName')
      .unsafeUnwrap()}_HelloWorld_lambda`;

    // Define la Lambda
    const myLambda2 = new lambda.Function(this, lambdaName2, {
      functionName: lambdaName2,
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('../lambdas/my-lambda/dist'),
      handler: 'index.handler',
    });
  }
}

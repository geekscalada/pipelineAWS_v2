import * as lambda from 'aws-cdk-lib/aws-lambda';
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
  }
}

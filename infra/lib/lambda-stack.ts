import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('../lambdas/my-lambda/dist'),
      handler: 'index.handler',
    });

    //TODO: how to name uniquely the lambda functions?
    const myLambda2 = new lambda.Function(this, 'MyLambda2', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('../lambdas/my-lambda/dist'),
      handler: 'index.handler',
    });
  }
}

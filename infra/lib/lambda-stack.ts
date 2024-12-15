import * as lambda from "aws-cdk-lib/aws-lambda";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Definir una Lambda que usa el código en "lambdas/my-lambda"
    const myLambda = new lambda.Function(this, "MyLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lambdas/my-lambda/dist"),
      handler: "index.handler", // Archivo y función principal de la Lambda
    });
  }
}

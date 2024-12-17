// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
// import * as dotenv from 'dotenv';

// Load variables desde .env

/**
 * This is not neccesary to this project but here we can see how to load variables from .env file
 * and push them to the secrets manager
 */

// dotenv.config();

// export class SecretsManagerStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const secret = new secretsmanager.Secret(this, 'PipelineSecrets', {
//       secretName: 'pipeline-secrets',
//       description: 'Secrets for the CI/CD pipeline',
//       secretStringValue: cdk.SecretValue.unsafePlainText(
//         JSON.stringify({
//           AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
//           AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
//         }),
//       ),
//     });

//     // Show the ARN of the secret, so we can use it in the pipeline
//     new cdk.CfnOutput(this, 'SecretArn', {
//       value: secret.secretArn,
//       description: 'ARN of the created Secret in AWS Secrets Manager',
//     });
//   }
// }

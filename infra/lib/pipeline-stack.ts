import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define artifact bucket for pipeline
    const artifactBucket = new cdk.aws_s3.Bucket(this, 'PipelineArtifactsBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Define output artifact for Source stage
    const sourceOutput = new codepipeline.Artifact();

    // Retrieve GitHub OAuth token from Secrets Manager
    const githubSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'github-token',
      'github-token',
    );

    // Define IAM Role for pipeline with large permissions
    const pipelineRole = new iam.Role(this, 'PipelineRole', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
    });

    pipelineRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
    );

    // Define IAM Role for CodeBuild with large permissions
    const buildRole = new iam.Role(this, 'CodeBuildServiceRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    buildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    // Create the pipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      artifactBucket,
      role: pipelineRole,
    });

    // Add Source stage
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: 'Checkout',
          owner: 'GEEKSCALADA', // Replace with GitHub owner
          repo: 'pipelineAWS_v2', // Replace with GitHub repo
          branch: 'preproduction', // Replace with the branch to monitor
          oauthToken: cdk.SecretValue.secretsManager(githubSecret.secretName, {
            jsonField: 'github-token',
          }),
          output: sourceOutput,
          trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
        }),
      ],
    });

    // Add Build stage
    const buildOutput = new codepipeline.Artifact();
    const buildProject = new cdk.aws_codebuild.PipelineProject(this, 'BuildProject', {
      role: buildRole,
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Build',
          input: sourceOutput,
          outputs: [buildOutput],
          project: buildProject,
        }),
      ],
    });

    // Additional stages like Deploy can be added similarly
  }
}

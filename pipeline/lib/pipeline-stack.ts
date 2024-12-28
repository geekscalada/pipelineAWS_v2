import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
dotenv.config();

export interface PipelineStackProps extends cdk.StackProps {
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  environmentName: string;
  projectName: string;
}

//TODO: GENERAR UN SECRET PARA EL TOKEN DE GITHUB

export class SecretPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    //import dotenv from 'dotenv';

    const gitHubToken = process.env.GITHUB_TOKEN;

    if (!gitHubToken) {
      throw new Error('GitHub token is required, fill your .env file');
    }

    // Crear el secreto en AWS Secrets Manager
    new secretsmanager.Secret(this, `SecretPipeline`, {
      secretName: `Secret-pipeline`,
      secretObjectValue: {
        gitHubToken2: cdk.SecretValue.unsafePlainText(gitHubToken),
      },
    });
  }
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { githubOwner, githubRepo, githubBranch, environmentName, projectName } = props;

    // Generar nombres dinámicos basados en el entorno
    const pipelineName = `${projectName}-${environmentName}-pipeline`;
    const artifactBucketName = `${projectName}-${environmentName}-artifact`;

    // Define artifact bucket for pipeline
    const artifactBucket = new cdk.aws_s3.Bucket(this, 'PipelineArtifactsBucket', {
      bucketName: artifactBucketName,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Define output artifact for Source stage
    const sourceOutput = new codepipeline.Artifact();

    const githubSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'Secret-pipeline',
      'gitHubToken2',
    );

    const pipelineRole = new iam.Role(this, 'PipelineRole', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
    });

    pipelineRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
    );

    const buildRole = new iam.Role(this, 'CodeBuildServiceRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    buildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    // Create the pipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName,
      artifactBucket,
      role: pipelineRole,
    });

    // Add Source stage
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: `Checkout-${environmentName}`,
          owner: githubOwner,
          repo: githubRepo,
          branch: githubBranch,
          oauthToken: cdk.SecretValue.secretsManager(githubSecret.secretName, {
            jsonField: 'gitHubToken2',
          }),
          output: sourceOutput,
          trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
        }),
      ],
    });

    /**
     * Add Build stage
     * This stage will build the application using CodeBuild and the buildspec.yml file
     */

    const buildOutput = new codepipeline.Artifact();
    const buildProject = new cdk.aws_codebuild.PipelineProject(this, 'BuildProject', {
      role: buildRole,
      buildSpec: cdk.aws_codebuild.BuildSpec.fromSourceFilename(
        `./pipeline/${environmentName}-buildspec.yml`,
      ),
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: `Build-${environmentName}`,
          input: sourceOutput,
          outputs: [buildOutput],
          project: buildProject,
        }),
      ],
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codestarconnections from 'aws-cdk-lib/aws-codestarconnections';
import * as iam from 'aws-cdk-lib/aws-iam';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Crear la conexión con GitHub en CodeStar Connections
    const codestarConnection = new codestarconnections.CfnConnection(this, 'GitHubConnection', {
      connectionName: 'GitHubConnection', // Nombre descriptivo
      providerType: 'GitHub', // Tipo de proveedor (puede ser GitHub o GitHub Enterprise Server)
    });

    // 1. Fuente: Conexión con GitHub usando la conexión creada
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'GitHub_Source',
      connectionArn: codestarConnection.attrConnectionArn, // ARN generado automáticamente por la conexión
      owner: 'GEEKSCALADA', // Usuario/organización de GitHub
      repo: 'pipelineAWS_v2', // Repositorio
      branch: 'preproduction', // Rama a escuchar
      output: sourceOutput,
      triggerOnPush: true, // Activar la acción en cada push (por si se queda colgada)
    });

    // 2. Build: Compilación y despliegue con CDK
    // Proyecto de CodeBuild con referencia al buildspec.yml
    const buildProject = new codebuild.PipelineProject(this, 'LambdaBuildProject', {
      buildSpec: codebuild.BuildSpec.fromSourceFilename('infra/buildspec.yml'), // Ruta al buildspec
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
        environmentVariables: {
          NODE_ENV: { value: 'production' },
        },
      },
    });

    buildProject.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
    );

    const buildOutput = new codepipeline.Artifact();

    // 3. Pipeline: Define las etapas
    new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'CDKPipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction], // Etapa de origen
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'CDK_Build',
              project: buildProject,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
      ],
    });
  }
}

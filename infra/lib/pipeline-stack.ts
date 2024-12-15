import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codestarconnections from "aws-cdk-lib/aws-codestarconnections";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Crear la conexión con GitHub en CodeStar Connections
    const codestarConnection = new codestarconnections.CfnConnection(this, "GitHubConnection", {
      connectionName: "GitHubConnection", // Nombre descriptivo
      providerType: "GitHub", // Tipo de proveedor (puede ser GitHub o GitHub Enterprise Server)
    });

    // 1. Fuente: Conexión con GitHub usando la conexión creada
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: "GitHub_Source",
      connectionArn: codestarConnection.attrConnectionArn, // ARN generado automáticamente por la conexión
      owner: "GEEKSCALADA", // Usuario/organización de GitHub
      repo: "pipelineAWS", // Repositorio
      branch: "preproduction", // Rama a escuchar
      output: sourceOutput,
    });
    

    // 2. Build: Compilación y despliegue con CDK
    const buildProject = new codebuild.PipelineProject(this, "CdkBuild", {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: [
              "npm install -g aws-cdk", // Instala CDK globalmente
              "npm install", // Instala dependencias locales
            ],
          },
          build: {
            commands: [
              "npx cdk synth", // Sintetiza la plantilla de CloudFormation
              "npx cdk deploy --require-approval never", // Despliega los cambios
            ],
          },
        },
        artifacts: {
          "base-directory": ".", // Carpeta raíz para CDK
          files: ["**/*"],
        },
      }),
    });

    const buildOutput = new codepipeline.Artifact();

    // 3. Pipeline: Define las etapas
    new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "CDKPipeline",
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction], // Etapa de origen
        },
        {
          stageName: "Build",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: "CDK_Build",
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

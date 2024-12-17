import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import * as codestarconnections from 'aws-cdk-lib/aws-codestarconnections';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Crear la conexión CodeStar para GitHub
    const codestarConnection = new codestarconnections.CfnConnection(this, 'GitHubConnection', {
      connectionName: 'GitHubConnection', // Nombre de la conexión
      providerType: 'GitHub', // Tipo de proveedor
    });

    // 2. Definir la pipeline V2
    const pipeline = new CodePipeline(this, 'CDKPipelineV2', {
      pipelineName: 'CDKPipelineV2',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          'GEEKSCALADA/pipelineAWS_v2', // Repositorio en formato 'owner/repo'
          'preproduction', // Rama del repositorio
          {
            connectionArn: codestarConnection.attrConnectionArn, // ARN de la conexión CodeStar
          },
        ),
        commands: ['../../buildspec.sh'],
        primaryOutputDirectory: 'cdk.out', // Directorio de salida para la síntesis
      }),
    });

    // 3. Opcional: Agregar permisos adicionales
    // pipeline.addStage(
    //   new cdk.Stage(this, 'DeployStage', {
    //     stageName: 'Deploy',
    //     // Agrega aquí aplicaciones adicionales si es necesario
    //   }),
    // );
  }
}

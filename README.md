# Getting started

## We need...

//TODO: REVISAR ESTA PARTE DE PERMISOS

- A gitHub repository and a PAT token with the following permissions:
  - repo
  - admin:repo_hook
  - workflow
  - An AWS account and configure a profile using the AWS CLI.
  - aws configure --profile <profile-name>

## First steps

### Launch the cdk for deploy the pipeline first time

- cd infra
- npm i
- npm run build TODO: environments variables NOOOOT, just secret-stack
- npx cdk deploy --context env=pre --all --profile <profile-name>

### Validate connection to github

- Go to your account at AWS
- Go to CodePipeline and select your new pipeline
- Go to edit/source/edit source
- Click to connect to github and connect to your repository
- Select the repo and branch you want to use
- OK and save
- Accept the webhook creation
- Go to your gitHUB repository and check the webhook created
- Go to AWS CodePipeline and click to release the pipeline

## Using the automatic pipeline

- Push a new commit to the repository in the branch you selected to poll the changes
- For this, you can uncomment the different constructs in the app to see the changes in your
  infrastructure

## Destroy your infrastructure

- cdk destroy --profile <profile-name>

TODO: REVISAR

Comportamiento en una Pipeline con buildspec.yml Roles IAM Asignados a la Pipeline:

En AWS CodePipeline o CodeBuild, el servicio asume un rol IAM que determina las credenciales y
permisos. El rol IAM debe tener permisos para determinar la cuenta y región donde se despliega. CDK
Default Context:

En la pipeline, si no defines explícitamente las variables, CDK usa la cuenta y región que obtiene
del contexto actual del rol IAM. La configuración del contexto depende del servicio en el que se
ejecuta la pipeline, por ejemplo: CodePipeline/CodeBuild: El entorno ejecuta comandos usando las
credenciales del rol IAM. GitHub Actions: Configuras las credenciales usando secretos
(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).

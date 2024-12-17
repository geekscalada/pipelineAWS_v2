# Getting started

You need to make your first build outside the pipeline.

## Using the pipeline

Comportamiento en una Pipeline con buildspec.yml Roles IAM Asignados a la Pipeline:

En AWS CodePipeline o CodeBuild, el servicio asume un rol IAM que determina las credenciales y
permisos. El rol IAM debe tener permisos para determinar la cuenta y región donde se despliega. CDK
Default Context:

En la pipeline, si no defines explícitamente las variables, CDK usa la cuenta y región que obtiene
del contexto actual del rol IAM. La configuración del contexto depende del servicio en el que se
ejecuta la pipeline, por ejemplo: CodePipeline/CodeBuild: El entorno ejecuta comandos usando las
credenciales del rol IAM. GitHub Actions: Configuras las credenciales usando secretos
(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).

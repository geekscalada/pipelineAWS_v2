#!/bin/bash

# Instalar dependencias
echo "Installing dependencies..."
cd infra && npm install --include=dev

# Instalar TypeScript globalmente
echo "Installing TypeScript globally..."
npm install -g typescript

# Verificar la instalación de TypeScript
echo "Verifying TypeScript installation..."
tsc --version

# Mostrar directorio actual
echo "Current directory:"
pwd

# Instalar dependencias para my-lambda
echo "Installing dependencies for my-lambda..."
cd ../lambdas/my-lambda && npm install --include=dev

# Construir infraestructura
echo "Building infrastructure..."
cd ../../infra && npx tsc
ls -lah

# Construir my-lambda
echo "Building my-lambda..."
ls -lah
cd ../lambdas/my-lambda && npx tsc
ls -lah

# Sintetizar CDK
echo "Synthesizing CDK..."
cd ../../infra && npx cdk synth

# Desplegar CDK
echo "Deploying CDK stack..."
npx cdk deploy --all --require-approval never

# Mensaje final
echo "Deployment completed successfully!"

#!/bin/bash

# Azure Deployment Script for AI Intelligence Complete Fresh
# Uses GitHub CLI to set secrets and Azure CLI to deploy

set -e

echo "🚀 Starting Azure Deployment..."

# Variables
RESOURCE_GROUP="ai-intelligence-rg"
LOCATION="eastus"
POSTGRES_LOCATION="westus"
APP_NAME="ai-intelligence-fresh"
POSTGRES_SERVER="ai-intelligence-db"
POSTGRES_DB="ainews"
POSTGRES_USER="aiuser"
POSTGRES_PASSWORD="AINews2024!Secure"
GITHUB_REPO="caiocarvalho93/ai-intelligence-complete-fresh"

echo "📦 Resource Group: $RESOURCE_GROUP"
echo "📍 Location: $LOCATION"
echo "🌐 App Name: $APP_NAME"

# Use existing or create Resource Group
echo "Ensuring resource group exists..."
az group create --name $RESOURCE_GROUP --location $LOCATION || true

# Create PostgreSQL Server
echo "🗄️ Creating Azure PostgreSQL Flexible Server..."
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --location $POSTGRES_LOCATION \
  --admin-user $POSTGRES_USER \
  --admin-password $POSTGRES_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32 \
  --public-access 0.0.0.0-255.255.255.255

# Create Database
echo "Creating database..."
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $POSTGRES_SERVER \
  --database-name $POSTGRES_DB

# Get PostgreSQL Connection String
POSTGRES_HOST="${POSTGRES_SERVER}.postgres.database.azure.com"
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}?sslmode=require"

echo "✅ PostgreSQL created: $POSTGRES_HOST"

# Create App Service Plan
echo "Creating App Service Plan..."
az appservice plan create \
  --name ${APP_NAME}-plan \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App
echo "🌐 Creating Web App with Node.js 22 LTS..."
az webapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan ${APP_NAME}-plan \
  --runtime "NODE:22-lts"

# Configure deployment from GitHub
echo "🔗 Connecting to GitHub..."
az webapp deployment source config \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --repo-url https://github.com/$GITHUB_REPO \
  --branch main \
  --manual-integration

# Set environment variables
echo "🔑 Setting environment variables..."
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    DATABASE_URL="$DATABASE_URL" \
    NEWS_API_KEY="80880b6ccb1859033d4d0df5064fb12e" \
    NEWSDATA_API_KEY="80880b6ccb1859033d4d0df5064fb12e" \
    NEWS_API_KEY_FALLBACK="pub_da3a034d1d0e419892ff9574f0262f4c" \
    OPENAI_API_KEY="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" \
    GROK_API_KEY="xai-dyj1HsO7Rep6hZ6oFMkVe4tMzKuLeJ6A09etFPg0IV4r6sVd4XMMndY6kuWFrtgC95i9mECZwfXPjOB2" \
    ALPHA_VANTAGE_API_KEY="VQZ228GQKHENOZDD" \
    ALLOWED_ORIGIN="https://website-project-ai.vercel.app" \
    NODE_ENV="production" \
    PORT="8080" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true"

# Set startup command
echo "⚙️ Setting startup command..."
az webapp config set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --startup-file "cd backend && npm install && npm start"

# Store secrets in GitHub
echo "🔐 Storing secrets in GitHub..."
cd /Users/caifitness/Desktop/news-cai/ai-intelligence-complete-fresh
gh secret set AZURE_DATABASE_URL --body "$DATABASE_URL"
gh secret set AZURE_APP_NAME --body "$APP_NAME"
gh secret set AZURE_RESOURCE_GROUP --body "$RESOURCE_GROUP"

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Your app: https://${APP_NAME}.azurewebsites.net"
echo "🗄️ PostgreSQL: $POSTGRES_HOST"
echo "📊 Database: $POSTGRES_DB"
echo ""
echo "Test your app:"
echo "curl https://${APP_NAME}.azurewebsites.net/health"
echo ""

#!/bin/bash

# Azure Deployment Script for AI Intelligence Complete Fresh
# Uses GitHub CLI to set secrets and Azure CLI to deploy

set -e

# Optionally load secrets from a local env file. This lets you keep sensitive
# values outside of version control while still running the script from your
# IDE or terminal. The default file is ".azure.env", but you can override it by
# setting AZURE_ENV_FILE before invoking the script.
AZURE_ENV_FILE="${AZURE_ENV_FILE:-.azure.env}"
if [ -f "$AZURE_ENV_FILE" ]; then
  echo "🗂️  Loading secrets from $AZURE_ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$AZURE_ENV_FILE"
  set +a
fi

echo "🚀 Starting Azure Deployment..."

# Variables
RESOURCE_GROUP="ai-intelligence-rg"
LOCATION="eastus"
POSTGRES_LOCATION="westus"
APP_NAME="ai-intelligence-fresh"
POSTGRES_SERVER="ai-intelligence-db"
POSTGRES_DB="ainews"
POSTGRES_USER="aiuser"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD before running this script}" 
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

# Required secret environment variables must already be exported where this
# script is executed. This prevents accidental secret leakage in source
# control.
: "${NEWS_API_KEY:?Set NEWS_API_KEY before running this script}"
: "${NEWSDATA_API_KEY:?Set NEWSDATA_API_KEY before running this script}"
: "${NEWS_API_KEY_FALLBACK:?Set NEWS_API_KEY_FALLBACK before running this script}"
: "${OPENAI_API_KEY:?Set OPENAI_API_KEY before running this script}"
: "${GROK_API_KEY:?Set GROK_API_KEY before running this script}"
: "${ALPHA_VANTAGE_API_KEY:?Set ALPHA_VANTAGE_API_KEY before running this script}"
ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-https://website-project-ai.vercel.app}"

# Set environment variables
echo "🔑 Setting environment variables..."
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    DATABASE_URL="$DATABASE_URL" \
    NEWS_API_KEY="$NEWS_API_KEY" \
    NEWSDATA_API_KEY="$NEWSDATA_API_KEY" \
    NEWS_API_KEY_FALLBACK="$NEWS_API_KEY_FALLBACK" \
    OPENAI_API_KEY="$OPENAI_API_KEY" \
    GROK_API_KEY="$GROK_API_KEY" \
    ALPHA_VANTAGE_API_KEY="$ALPHA_VANTAGE_API_KEY" \
    ALLOWED_ORIGIN="$ALLOWED_ORIGIN" \
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
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR" && git rev-parse --show-toplevel 2>/dev/null || echo "$SCRIPT_DIR")
cd "$REPO_ROOT"
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

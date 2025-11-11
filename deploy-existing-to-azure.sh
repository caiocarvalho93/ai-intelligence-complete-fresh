#!/bin/bash

# Deploy existing website-project to Azure (keeping Railway PostgreSQL)
# No changes to your code - just moving from Vercel to Azure

set -e

echo "🚀 Deploying your existing project to Azure..."
echo "✅ Keeping Railway PostgreSQL (no database changes)"
echo "✅ Keeping all your existing APIs and features"
echo "=================================================="

# Configuration
RESOURCE_GROUP="ai-intelligence-rg"
APP_NAME="ai-intelligence-network"
LOCATION="East US"

# Check Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Install it first:"
    echo "   brew install azure-cli"
    exit 1
fi

# Login check
echo "1️⃣ Checking Azure login..."
if ! az account show &> /dev/null; then
    echo "🔐 Please log in to Azure:"
    az login
fi

echo "✅ Logged in to Azure"

# Create resource group
echo "2️⃣ Creating Azure resource group..."
az group create \
    --name $RESOURCE_GROUP \
    --location "$LOCATION" \
    --output table

# Deploy web app
echo "3️⃣ Creating Azure App Service..."
az deployment group create \
    --resource-group $RESOURCE_GROUP \
    --template-file azure-webapp-deploy.json \
    --parameters webAppName=$APP_NAME location="$LOCATION"

# Configure environment variables from your existing .env
echo "4️⃣ Configuring environment variables..."

# Read your existing .env and set them in Azure
if [ -f ".env" ]; then
    echo "📋 Found .env file, configuring Azure App Service..."
    
    # Extract key environment variables (keeping your Railway DB)
    DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"')
    GROK_API_KEY=$(grep "^GROK_API_KEY=" .env | cut -d '=' -f2- | tr -d '"')
    OPENAI_API_KEY=$(grep "^OPENAI_API_KEY=" .env | cut -d '=' -f2- | tr -d '"')
    NEWSAPI_KEY=$(grep "^NEWSAPI_KEY=" .env | cut -d '=' -f2- | tr -d '"')
    NEWSDATA_API_KEY=$(grep "^NEWSDATA_API_KEY=" .env | cut -d '=' -f2- | tr -d '"')
    JOOBLE_API_KEY=$(grep "^JOOBLE_API_KEY=" .env | cut -d '=' -f2- | tr -d '"')
    
    # Set environment variables in Azure
    az webapp config appsettings set \
        --resource-group $RESOURCE_GROUP \
        --name $APP_NAME \
        --settings \
            NODE_ENV=production \
            PORT=8080 \
            DATABASE_URL="$DATABASE_URL" \
            GROK_API_KEY="$GROK_API_KEY" \
            OPENAI_API_KEY="$OPENAI_API_KEY" \
            NEWSAPI_KEY="$NEWSAPI_KEY" \
            NEWSDATA_API_KEY="$NEWSDATA_API_KEY" \
            JOOBLE_API_KEY="$JOOBLE_API_KEY"
    
    echo "✅ Environment variables configured"
else
    echo "⚠️ No .env file found. You'll need to configure environment variables manually."
fi

# Configure deployment source
echo "5️⃣ Setting up Git deployment..."
az webapp deployment source config-local-git \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP

# Get deployment URL
DEPLOYMENT_URL=$(az webapp deployment source config-local-git \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query url -o tsv)

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Azure deployment"
fi

# Add Azure remote
echo "🔗 Adding Azure deployment remote..."
git remote remove azure 2>/dev/null || true
git remote add azure $DEPLOYMENT_URL

# Deploy
echo "6️⃣ Deploying to Azure..."
echo "📤 Pushing your existing code to Azure..."
git push azure main:master

# Get the final URL
WEB_APP_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME --query defaultHostName -o tsv)

echo "=================================================="
echo "🎉 Deployment Complete!"
echo ""
echo "🌐 Your website is now live at:"
echo "   https://$WEB_APP_URL"
echo ""
echo "📊 What's deployed:"
echo "   ✅ Your existing React frontend"
echo "   ✅ Your existing Node.js backend"
echo "   ✅ Railway PostgreSQL (unchanged)"
echo "   ✅ All your existing APIs and features"
echo ""
echo "🎯 Share this URL with recruiters:"
echo "   https://$WEB_APP_URL"
echo ""
echo "📋 Useful commands:"
echo "   View logs: az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "   Restart: az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP"
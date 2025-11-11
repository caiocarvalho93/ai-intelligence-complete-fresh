#!/bin/bash

# Azure Deployment Script for AI Intelligence Network
# This script deploys your website to Azure App Service with MongoDB

set -e

echo "🚀 Starting Azure deployment for AI Intelligence Network..."
echo "=================================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Configuration
RESOURCE_GROUP="ai-intelligence-rg"
APP_NAME="ai-intelligence-network"
LOCATION="East US"
SKU="F1"  # Free tier - change to B1 or higher for production

# Check if user is logged in to Azure
echo "1️⃣ Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "🔐 Please log in to Azure:"
    az login
fi

# Get current subscription
SUBSCRIPTION=$(az account show --query id -o tsv)
echo "✅ Using subscription: $SUBSCRIPTION"

# Create resource group if it doesn't exist
echo "2️⃣ Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION" --output table

# Prompt for environment variables
echo "3️⃣ Setting up environment variables..."
echo "Please provide the following configuration:"

read -p "MongoDB Atlas Connection String: " MONGODB_URI
read -p "NewsAPI Key: " NEWS_API_KEY
read -p "OpenAI API Key (optional): " OPENAI_API_KEY

# Validate MongoDB connection string
if [[ ! $MONGODB_URI =~ ^mongodb ]]; then
    echo "❌ Invalid MongoDB connection string. It should start with 'mongodb://' or 'mongodb+srv://'"
    exit 1
fi

# Deploy using ARM template
echo "4️⃣ Deploying Azure resources..."
az deployment group create \
    --resource-group $RESOURCE_GROUP \
    --template-file azure-deploy.json \
    --parameters \
        appName=$APP_NAME \
        location="$LOCATION" \
        sku=$SKU \
        mongodbConnectionString="$MONGODB_URI" \
        newsApiKey="$NEWS_API_KEY" \
        openaiApiKey="$OPENAI_API_KEY"

# Get the web app URL
WEB_APP_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME --query defaultHostName -o tsv)

echo "5️⃣ Configuring deployment source..."

# Configure local git deployment
az webapp deployment source config-local-git \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --output table

# Get deployment credentials
DEPLOYMENT_URL=$(az webapp deployment source config-local-git \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query url -o tsv)

echo "6️⃣ Preparing application for deployment..."

# Create deployment package
npm install --production
npm run build 2>/dev/null || echo "No build script found, skipping..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit for Azure deployment"
fi

# Add Azure remote
git remote remove azure 2>/dev/null || true
git remote add azure $DEPLOYMENT_URL

echo "7️⃣ Deploying to Azure..."
echo "You may be prompted for deployment credentials."
echo "Use the credentials from Azure Portal > App Service > Deployment Center"

# Deploy to Azure
git push azure main:master

echo "8️⃣ Running post-deployment setup..."

# Run MongoDB migration
echo "Setting up MongoDB collections..."
az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME --command "cd /home/site/wwwroot && node backend/migrate-to-mongodb.js" || echo "Migration will run on first startup"

echo "=================================================="
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   App Service: $APP_NAME"
echo "   URL: https://$WEB_APP_URL"
echo "   SKU: $SKU"
echo ""
echo "🔗 Your website is now live at:"
echo "   https://$WEB_APP_URL"
echo ""
echo "📊 Next steps:"
echo "1. Test your website at the URL above"
echo "2. Monitor logs: az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "3. Scale up if needed: az appservice plan update --name ${APP_NAME}-plan --resource-group $RESOURCE_GROUP --sku B1"
echo ""
echo "💡 Useful commands:"
echo "   View logs: az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "   Restart app: az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "   SSH into app: az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo ""
echo "🎯 Share this URL with recruiters:"
echo "   https://$WEB_APP_URL"
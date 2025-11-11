#!/bin/bash

echo "🚀 CAI News - Azure Deployment Script"
echo "======================================"
echo ""

# Configuration
RESOURCE_GROUP="cai-news"
APP_NAME="cai-news"
LOCATION="westus"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if logged in to Azure
echo -e "${BLUE}🔐 Checking Azure login...${NC}"
az account show > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️  Not logged in to Azure. Logging in...${NC}"
  az login
fi

echo -e "${GREEN}✅ Azure login confirmed${NC}"
echo ""

# Step 1: Build frontend
echo -e "${BLUE}📦 Step 1/6: Building frontend...${NC}"
cd frontend
npm run build

if [ ! -d "dist" ]; then
  echo -e "${RED}❌ Frontend build failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Frontend built${NC}"
cd ..

# Step 2: Create deployment structure
echo -e "${BLUE}📁 Step 2/6: Creating deployment structure...${NC}"
rm -rf azure-deploy
mkdir -p azure-deploy/wwwroot/frontend
mkdir -p azure-deploy/wwwroot/backend

# Copy frontend
cp -r frontend/dist/* azure-deploy/wwwroot/frontend/

# Copy backend
cp production-server.js azure-deploy/wwwroot/backend/server.js
cp package.json azure-deploy/wwwroot/backend/
cp package-lock.json azure-deploy/wwwroot/backend/ 2>/dev/null || true

# Copy web.config to root
cp web.config azure-deploy/wwwroot/

# Create startup script
cat > azure-deploy/wwwroot/startup.sh << 'STARTUP'
#!/bin/bash
cd /home/site/wwwroot/backend
npm install --production
node server.js
STARTUP

chmod +x azure-deploy/wwwroot/startup.sh

echo -e "${GREEN}✅ Deployment structure created${NC}"

# Step 3: Create deployment package
echo -e "${BLUE}📦 Step 3/6: Creating deployment package...${NC}"
cd azure-deploy/wwwroot
zip -r ../../cai-news-azure.zip . -x "*.DS_Store" "*.git*" > /dev/null
cd ../..

echo -e "${GREEN}✅ Package created: cai-news-azure.zip${NC}"

# Step 4: Deploy to Azure
echo -e "${BLUE}🚀 Step 4/6: Deploying to Azure App Service...${NC}"
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src cai-news-azure.zip

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Deployment successful${NC}"
else
  echo -e "${RED}❌ Deployment failed${NC}"
  exit 1
fi

# Step 5: Configure App Service settings
echo -e "${BLUE}⚙️  Step 5/6: Configuring App Service...${NC}"

# Set Node version
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --linux-fx-version "NODE|18-lts" \
  --startup-file "backend/server.js"

# Configure app settings
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    WEBSITE_NODE_DEFAULT_VERSION=18-lts \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

echo -e "${GREEN}✅ App Service configured${NC}"

# Step 6: Restart app
echo -e "${BLUE}🔄 Step 6/6: Restarting App Service...${NC}"
az webapp restart \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME

echo -e "${GREEN}✅ App Service restarted${NC}"
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📱 Your app is available at:${NC}"
echo "https://cai-news-cwb3aebqdze3d2f0.westus-01.azurewebsites.net"
echo ""
echo -e "${YELLOW}⚠️  Important: Configure your environment variables${NC}"
echo "Run this command to add your OpenAI API key:"
echo ""
echo -e "${BLUE}az webapp config appsettings set \\${NC}"
echo -e "${BLUE}  --resource-group $RESOURCE_GROUP \\${NC}"
echo -e "${BLUE}  --name $APP_NAME \\${NC}"
echo -e "${BLUE}  --settings OPENAI_API_KEY=your_key_here${NC}"
echo ""
echo -e "${GREEN}🌍 ONE LOVE - Your app is live!${NC}"

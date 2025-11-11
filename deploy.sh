#!/bin/bash

echo "🚀 Starting Azure deployment for CAI News..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build frontend
echo -e "${BLUE}📦 Building frontend...${NC}"
cd frontend
npm install
npm run build

if [ ! -d "dist" ]; then
  echo -e "${RED}❌ Frontend build failed - dist folder not found${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
cd ..

# Step 2: Create deployment directory
echo -e "${BLUE}📁 Creating deployment structure...${NC}"
rm -rf deploy
mkdir -p deploy/frontend
mkdir -p deploy/backend

# Step 3: Copy frontend build
echo -e "${BLUE}📋 Copying frontend files...${NC}"
cp -r frontend/dist/* deploy/frontend/

# Step 4: Copy backend files
echo -e "${BLUE}📋 Copying backend files...${NC}"
cp production-server.js deploy/backend/server.js
cp package.json deploy/backend/
cp package-lock.json deploy/backend/ 2>/dev/null || true

# Step 5: Create root package.json for Azure
echo -e "${BLUE}📝 Creating deployment package.json...${NC}"
cat > deploy/package.json << 'EOF'
{
  "name": "cai-news-app",
  "version": "1.0.0",
  "description": "CAI News - Full Stack Application",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js"
  },
  "engines": {
    "node": ">=18.x"
  }
}
EOF

# Step 6: Copy web.config
echo -e "${BLUE}📋 Copying web.config...${NC}"
cp web.config deploy/

# Step 7: Create .env template
echo -e "${BLUE}📝 Creating .env template...${NC}"
cat > deploy/.env.example << 'EOF'
# Server Configuration
PORT=8080
NODE_ENV=production

# Translation Services (configure at least one)
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Optional: Other translation services
# GOOGLE_TRANSLATE_API_KEY=your_google_key
# AZURE_TRANSLATOR_KEY=your_azure_key
# AZURE_TRANSLATOR_REGION=your_region
# AWS_ACCESS_KEY_ID=your_aws_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret

# Security
ALLOWED_ORIGINS=https://cai-news-cwb3aebqdze3d2f0.westus-01.azurewebsites.net
ADMIN_KEY=your_secure_admin_key_here

# Rate Limiting
RATE_LIMIT_POINTS=100
RATE_LIMIT_DURATION=60

# Optional: Database
# DATABASE_URL=your_database_url
# SAVE_TRANSLATIONS=true
EOF

# Step 8: Create deployment zip
echo -e "${BLUE}📦 Creating deployment package...${NC}"
cd deploy
zip -r ../cai-news-deployment.zip . -x "*.DS_Store" "*.git*"
cd ..

echo -e "${GREEN}✅ Deployment package created: cai-news-deployment.zip${NC}"
echo ""
echo -e "${BLUE}📤 Next steps:${NC}"
echo "1. Go to Azure Portal: https://portal.azure.com"
echo "2. Navigate to your App Service: cai-news"
echo "3. Go to 'Deployment Center'"
echo "4. Choose 'Local Git' or 'ZIP Deploy'"
echo "5. Upload cai-news-deployment.zip"
echo ""
echo -e "${BLUE}🔧 Or deploy using Azure CLI:${NC}"
echo "az webapp deployment source config-zip --resource-group cai-news --name cai-news --src cai-news-deployment.zip"
echo ""
echo -e "${BLUE}⚙️ Don't forget to configure environment variables in Azure:${NC}"
echo "1. Go to Configuration > Application settings"
echo "2. Add your API keys and settings from .env.example"
echo ""
echo -e "${GREEN}🌍 ONE LOVE - Your app is ready to deploy!${NC}"

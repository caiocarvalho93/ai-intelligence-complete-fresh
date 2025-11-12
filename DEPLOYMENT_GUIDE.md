# Deployment Guide - Railway & Azure

## 🚂 Railway Deployment

### Step 1: Create New Railway Project from GitHub

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `caiocarvalho93/ai-intelligence-complete-fresh`
5. Railway will detect your backend automatically

### Step 2: Configure Railway Service

1. Select the **backend** folder as your root directory
2. Railway will use the `railway.json` and `railway.toml` configs
3. Build command: `npm install`
4. Start command: `npm start`

### Step 3: Add Environment Variables

Go to your Railway project → Variables tab and add:

```bash
# Database Connections (CRITICAL)
DATABASE_URL=your_postgresql_connection_string
MONGODB_URI=your_mongodb_connection_string

# API Keys
NEWS_API_KEY=your_news_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
NEWS_API_KEY_FALLBACK=your_fallback_news_api_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
GROK_API_KEY=your_grok_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# CORS
ALLOWED_ORIGIN=your_frontend_url

# Environment
NODE_ENV=production
PORT=8080
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Check logs for: `✅ Server running on port 8080`
4. Test your endpoint: `https://your-app.up.railway.app/health`

---

## ☁️ Azure Deployment

### Option 1: Deploy from GitHub (Recommended)

1. Go to [Azure Portal](https://portal.azure.com)
2. Create **Web App**
3. Choose:
   - **Publish**: Code
   - **Runtime**: Node 20 LTS
   - **Operating System**: Linux
4. In **Deployment** tab:
   - **Source**: GitHub
   - **Repository**: `caiocarvalho93/ai-intelligence-complete-fresh`
   - **Branch**: `main`
   - **Build Provider**: App Service Build Service

### Option 2: Deploy with Azure CLI

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name ai-intelligence-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name ai-intelligence-plan \
  --resource-group ai-intelligence-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name ai-intelligence-app \
  --resource-group ai-intelligence-rg \
  --plan ai-intelligence-plan \
  --runtime "NODE:20-lts"

# Configure deployment from GitHub
az webapp deployment source config \
  --name ai-intelligence-app \
  --resource-group ai-intelligence-rg \
  --repo-url https://github.com/caiocarvalho93/ai-intelligence-complete-fresh \
  --branch main \
  --manual-integration

# Set environment variables
az webapp config appsettings set \
  --name ai-intelligence-app \
  --resource-group ai-intelligence-rg \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DATABASE_URL="your_postgresql_url" \
    MONGODB_URI="your_mongodb_uri" \
    NEWS_API_KEY="your_news_api_key" \
    OPENAI_API_KEY="your_openai_key" \
    GROK_API_KEY="your_grok_key"
```

### Azure Environment Variables

Add these in Azure Portal → Configuration → Application settings:

```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=your_postgresql_connection_string
MONGODB_URI=your_mongodb_connection_string
NEWS_API_KEY=your_news_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
OPENAI_API_KEY=your_openai_api_key
GROK_API_KEY=your_grok_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
ALLOWED_ORIGIN=your_frontend_url
```

### Running the Azure CLI script from your IDE

The `deploy-azure.sh` script now loads secrets from your shell environment, so
you can keep Azure production keys out of source control:

1. Create a file named `.azure.env` in the project root (this file is ignored by
   Git). Add the required secrets, for example:

   ```bash
   POSTGRES_PASSWORD="super-secret-password"
   NEWS_API_KEY="..."
   NEWSDATA_API_KEY="..."
   NEWS_API_KEY_FALLBACK="..."
   OPENAI_API_KEY="..."
   GROK_API_KEY="..."
   ALPHA_VANTAGE_API_KEY="..."
   ALLOWED_ORIGIN="https://website-project-ai.vercel.app"
   ```

2. From your terminal or IDE, run:

   ```bash
   ./deploy-azure.sh
   ```

   The script automatically sources `.azure.env` (or a custom file specified via
   `AZURE_ENV_FILE=/path/to/file ./deploy-azure.sh`) before contacting Azure.

This keeps the deployment keys available locally while ensuring they never live
inside the repository. Azure receives the values during the deployment step.

### Azure Startup Command

In Azure Portal → Configuration → General settings:

**Startup Command**: `cd backend && npm install && npm start`

---

## 🔧 Quick Setup Script

Run this to commit and push your deployment configs:

```bash
cd ai-intelligence-complete-fresh
git add .
git commit -m "Update deployment configs for Railway and Azure"
git push origin main
```

---

## ✅ Verify Deployment

### Railway
```bash
curl https://your-app.up.railway.app/health
```

### Azure
```bash
curl https://your-app.azurewebsites.net/health
```

Both should return:
```json
{
  "status": "healthy",
  "mongodb": "connected",
  "postgresql": "connected"
}
```

---

## 🚨 Troubleshooting

### Railway Issues
- Check logs: Railway Dashboard → Deployments → Logs
- Verify environment variables are set
- Ensure MongoDB IP whitelist includes `0.0.0.0/0`

### Azure Issues
- Check logs: Azure Portal → Log stream
- Verify startup command is correct
- Check Application Insights for errors
- Ensure all environment variables are set

---

## 📝 Notes

- Railway auto-deploys on every push to `main`
- Azure can be configured for auto-deploy or manual
- Both platforms support custom domains
- Use Railway for development/staging
- Use Azure for production (if needed)

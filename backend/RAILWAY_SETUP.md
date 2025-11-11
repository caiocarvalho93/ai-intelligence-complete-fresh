# Railway Deployment Fix - Database Connection Issue

## Problem
Your backend is crashing on Railway after 1 second because it's missing the MongoDB connection string.

## Solution

### 1. Add MongoDB URI to Railway

Go to your Railway project dashboard and add this environment variable:

**Variable Name:** `MONGODB_URI`

**Variable Value:** 
```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cai-newsdb.zrddgt8.mongodb.net/?retryWrites=true&w=majority&appName=cai-newsdb
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual MongoDB Atlas credentials.

### 2. Verify PostgreSQL Connection

Make sure this variable is also set in Railway:

**Variable Name:** `DATABASE_URL`

**Current Value:** 
```
postgresql://postgres:ylQFKAOHIAJlNvOciiXAPbFuPThxzTxX@ballast.proxy.rlwy.net:49633/railway
```

### 3. Required Environment Variables for Railway

Here's the complete list of environment variables you need in Railway:

```bash
# Database Connections (CRITICAL)
DATABASE_URL=postgresql://postgres:ylQFKAOHIAJlNvOciiXAPbFuPThxzTxX@ballast.proxy.rlwy.net:49633/railway
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cai-newsdb.zrddgt8.mongodb.net/?retryWrites=true&w=majority&appName=cai-newsdb

# API Keys
NEWS_API_KEY=80880b6ccb1859033d4d0df5064fb12e
NEWSDATA_API_KEY=80880b6ccb1859033d4d0df5064fb12e
NEWS_API_KEY_FALLBACK=pub_da3a034d1d0e419892ff9574f0262f4c

# CORS
ALLOWED_ORIGIN=https://website-project-ai.vercel.app

# Environment
NODE_ENV=production
PORT=8080

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
GROK_API_KEY=your_grok_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here

# Blockchain
PRIVATE_KEY=9bf51c1fed26b2770cb0ad0a86903fd962282ff63795e9442a96a53fb637e226
RPC_URL=https://bsc-dataseed.binance.org/
```

### 4. How to Add Variables in Railway

1. Go to your Railway project
2. Click on your backend service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable name and value
6. Click "Deploy" to restart with new variables

### 5. Alternative: Use MongoDB Parts

If you don't have the full MongoDB URI, you can also set these individual variables:

```bash
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_HOST=cai-newsdb.zrddgt8.mongodb.net
MONGODB_DB_NAME=cai-newsdb
MONGODB_OPTIONS=retryWrites=true&w=majority&appName=cai-newsdb
```

The backend will automatically build the connection string from these parts.

### 6. Verify Deployment

After adding the MongoDB URI:

1. Railway will automatically redeploy
2. Check the logs for: `✅ MongoDB: Connected successfully to Atlas`
3. Test the health endpoint: `https://your-railway-url.up.railway.app/health`
4. You should see MongoDB status as "connected"

### 7. Common Issues

**Issue:** "MongoDB connection failed"
- Check that your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all IPs)
- Verify your username and password are correct
- Make sure your MongoDB cluster is running

**Issue:** "PostgreSQL unavailable"
- Verify the DATABASE_URL is correct
- Check that Railway PostgreSQL service is running
- Ensure SSL is enabled in the connection string

### 8. Test Endpoints

Once deployed, test these endpoints:

- Health check: `GET /health`
- Global news: `GET /api/global-news`
- Country news: `GET /api/country-news/US`
- Database test: `GET /api/test`

All should return successful responses with database connection info.

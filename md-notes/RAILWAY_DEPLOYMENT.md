# Railway Deployment Guide - CAI News

## Overview
Deploy your unified CAI News system to Railway with PostgreSQL database.

## Architecture on Railway

```
Railway Project: cainews
├── PostgreSQL Database (Plugin)
├── Node.js Backend (Port 8080)
└── Java Backend (Optional - Port 8081)
```

## Step 1: Install Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

## Step 2: Create Railway Project

```bash
# Initialize Railway project
cd cainews
railway init

# Link to existing project (if you have one)
# railway link
```

## Step 3: Add PostgreSQL Database

### Option A: Via Railway Dashboard
1. Go to https://railway.app/dashboard
2. Select your project
3. Click "New" → "Database" → "Add PostgreSQL"
4. Railway will automatically create `DATABASE_URL` variable

### Option B: Via CLI
```bash
railway add --plugin postgresql
```

## Step 4: Configure Environment Variables

### Set Backend Variables
```bash
# Database (automatically set by Railway PostgreSQL plugin)
# DATABASE_URL is auto-configured

# Server Configuration
railway variables set PORT=8080
railway variables set NODE_ENV=production

# API Keys (replace with your actual keys)
railway variables set NEWSAPI_KEY=your_newsapi_key
railway variables set NEWSDATA_API_KEY=your_newsdata_key
railway variables set OPENAI_API_KEY=your_openai_key

# Optional Services
railway variables set ALPHA_VANTAGE_API_KEY=your_key
railway variables set COINGECKO_API_KEY=your_key

# CORS Origins
railway variables set ALLOWED_ORIGIN=https://your-app.vercel.app
```

### Or Set via Dashboard
1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Add each variable

## Step 5: Create Railway Configuration

Railway configuration is already set in `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

## Step 6: Initialize Database Schema

### Create Database Tables Script
```bash
# Run database migration
railway run node backend/deploy.js
```

This will:
- Create all necessary tables
- Set up indexes
- Migrate any local data

## Step 7: Deploy Backend to Railway

```bash
# Deploy from current directory
railway up

# Or deploy specific service
railway up --service backend
```

## Step 8: Verify Deployment

### Check Service Status
```bash
# View logs
railway logs

# Check service status
railway status
```

### Test Health Endpoint
```bash
# Get your Railway URL
railway domain

# Test health endpoint
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "ok": true,
  "service": "AI Intelligence Network",
  "status": "OPERATIONAL",
  "database": {
    "type": "PostgreSQL Railway",
    "status": "connected"
  }
}
```

## Step 9: Get Database Connection Details

```bash
# View all environment variables
railway variables

# Get DATABASE_URL specifically
railway variables get DATABASE_URL
```

## Database Schema

The following tables will be created automatically:

### Articles Table
```sql
CREATE TABLE articles (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  source VARCHAR(255),
  author VARCHAR(255),
  published_at TIMESTAMP,
  description TEXT,
  country VARCHAR(10),
  category VARCHAR(50),
  rel_score INTEGER,
  ana_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `idx_articles_country` - Country filtering
- `idx_articles_published` - Date sorting
- `idx_articles_category` - Category filtering
- `idx_articles_scores` - Relevance sorting
- `idx_articles_url` - Duplicate prevention

## Monitoring

### View Logs
```bash
# Real-time logs
railway logs --follow

# Last 100 lines
railway logs --tail 100
```

### Check Metrics
1. Go to Railway Dashboard
2. Select your service
3. View "Metrics" tab for:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

## Scaling

### Vertical Scaling
Railway automatically scales based on your plan:
- **Hobby**: 512MB RAM, 1 vCPU
- **Pro**: 8GB RAM, 8 vCPU

### Horizontal Scaling
For multiple instances:
```bash
railway scale --replicas 2
```

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL is set
railway variables get DATABASE_URL

# Test database connection
railway run psql $DATABASE_URL -c "SELECT version();"
```

### Build Failures
```bash
# Clear build cache
railway build --clear-cache

# Rebuild
railway up --force
```

### Memory Issues
```bash
# Check memory usage
railway logs | grep "memory"

# Increase memory limit (Pro plan)
railway scale --memory 2048
```

### Port Issues
Ensure your backend uses `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 8080;
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Auto-set by Railway PostgreSQL |
| `PORT` | Yes | Auto-set by Railway (usually 8080) |
| `NODE_ENV` | Yes | Set to "production" |
| `NEWSAPI_KEY` | Yes | NewsAPI.org API key |
| `NEWSDATA_API_KEY` | Yes | NewsData.io API key |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `ALLOWED_ORIGIN` | Yes | Your Vercel frontend URL |
| `ALPHA_VANTAGE_API_KEY` | No | Stock market data |
| `COINGECKO_API_KEY` | No | Crypto market data |

## Custom Domain (Optional)

### Add Custom Domain
```bash
# Add domain
railway domain add yourdomain.com

# Railway will provide DNS records to configure
```

### Configure DNS
1. Go to your domain registrar
2. Add CNAME record:
   - Name: `api` (or `@` for root)
   - Value: `your-app.railway.app`

## Backup Strategy

### Database Backups
Railway Pro includes automatic daily backups.

### Manual Backup
```bash
# Export database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore database
railway run psql $DATABASE_URL < backup.sql
```

## Cost Optimization

### Hobby Plan (Free)
- $5 free credit per month
- 512MB RAM
- 1GB disk
- Good for development

### Pro Plan ($20/month)
- $20 credit included
- 8GB RAM
- 100GB disk
- Custom domains
- Priority support

### Tips to Reduce Costs
1. Use efficient queries
2. Implement caching
3. Optimize images
4. Use CDN for static assets
5. Monitor usage regularly

## Next Steps

After Railway deployment:
1. ✓ Backend deployed
2. ✓ Database created and initialized
3. → Deploy frontend to Vercel (see VERCEL_DEPLOYMENT.md)
4. → Update CORS origins
5. → Test end-to-end

## Quick Commands Reference

```bash
# Deploy
railway up

# View logs
railway logs --follow

# Check status
railway status

# Open dashboard
railway open

# Run command in Railway environment
railway run <command>

# Connect to database
railway connect postgres

# View variables
railway variables

# Set variable
railway variables set KEY=value
```

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

## Success Checklist

- [ ] Railway CLI installed
- [ ] Project initialized
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Backend deployed successfully
- [ ] Health endpoint responding
- [ ] Logs show no errors
- [ ] Database connection working
- [ ] Ready for Vercel frontend deployment

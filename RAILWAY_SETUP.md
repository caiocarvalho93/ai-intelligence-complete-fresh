# 🚂 Railway Setup - Quick Start

## Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `caiocarvalho93/ai-intelligence-complete-fresh`
5. Select **backend** folder as root directory

## Step 2: Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create `DATABASE_URL` variable

## Step 3: Add Environment Variables

Go to your backend service → **Variables** tab and add these:

```bash
# Railway auto-creates this when you add PostgreSQL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# News API Keys (get from newsapi.org and newsdata.io)
NEWS_API_KEY=your_newsapi_key_here
NEWSDATA_API_KEY=your_newsdata_key_here
NEWS_API_KEY_FALLBACK=your_fallback_key_here

# AI Services (get from platform.openai.com and x.ai)
OPENAI_API_KEY=your_openai_key_here
GROK_API_KEY=your_grok_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here

# CORS (your frontend URL)
ALLOWED_ORIGIN=https://your-frontend.vercel.app

# Server Config
NODE_ENV=production
PORT=8080
```

## Step 4: Deploy

Railway will automatically deploy. Check logs for:
```
✅ Server running on port 8080
✅ PostgreSQL: Connected successfully
```

## Step 5: Get Your Backend URL

1. Go to **Settings** tab
2. Click **"Generate Domain"**
3. Copy your URL: `https://your-app.up.railway.app`
4. Update `ALLOWED_ORIGIN` in variables with your frontend URL

## Step 6: Test Your Deployment

```bash
curl https://your-app.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "postgresql": "connected"
}
```

---

## 🔑 Where to Get API Keys

- **NEWS_API_KEY**: https://newsapi.org/register
- **NEWSDATA_API_KEY**: https://newsdata.io/register
- **OPENAI_API_KEY**: https://platform.openai.com/api-keys
- **GROK_API_KEY**: https://x.ai/api
- **ALPHA_VANTAGE_API_KEY**: https://www.alphavantage.co/support/#api-key

---

## ⚡ Quick Copy-Paste for Railway Variables

Replace the values with your actual keys:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEWS_API_KEY=80880b6ccb1859033d4d0df5064fb12e
NEWSDATA_API_KEY=80880b6ccb1859033d4d0df5064fb12e
NEWS_API_KEY_FALLBACK=pub_da3a034d1d0e419892ff9574f0262f4c
OPENAI_API_KEY=sk-your-key-here
GROK_API_KEY=xai-your-key-here
ALPHA_VANTAGE_API_KEY=your-key-here
ALLOWED_ORIGIN=https://website-project-ai.vercel.app
NODE_ENV=production
PORT=8080
```

---

## 🚨 Troubleshooting

**Build fails?**
- Make sure you selected `backend` folder as root
- Check that `package.json` exists in backend folder

**Database connection fails?**
- Verify PostgreSQL service is running in Railway
- Check `DATABASE_URL` is set correctly

**API errors?**
- Verify all API keys are valid
- Check Railway logs for specific errors

---

## ✅ You're Done!

Your backend is now live on Railway with PostgreSQL. No MongoDB needed!

# 🚂 Railway Quick Setup - Web UI Method

## Step 1: Create Project from GitHub

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `caiocarvalho93/ai-intelligence-complete-fresh`
5. Railway will ask which folder - select **backend**

## Step 2: Configure Build Settings

In your Railway project settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Step 3: Add PostgreSQL Database

1. Click **"New"** in your project
2. Select **"Database"** → **"PostgreSQL"**
3. Railway creates it automatically

## Step 4: Add Environment Variables

Click on your backend service → **Variables** tab → **Raw Editor**

Paste this (Railway will auto-link the DATABASE_URL):

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEWS_API_KEY=your_news_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
NEWS_API_KEY_FALLBACK=your_fallback_key
OPENAI_API_KEY=your_openai_key
GROK_API_KEY=your_grok_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
ALLOWED_ORIGIN=https://website-project-ai.vercel.app
NODE_ENV=production
PORT=8080
```

**Get your actual keys from:** `backend/.env` file

## Step 5: Deploy

Railway will automatically deploy. Wait for it to finish.

## Step 6: Get Your URL

1. Go to **Settings** tab
2. Under **Networking**, click **"Generate Domain"**
3. Your backend URL: `https://ai-intelligence-news-production.up.railway.app`

## Step 7: Test

```bash
curl https://your-url.up.railway.app/health
```

---

## ✅ Done!

Your backend is live on Railway with PostgreSQL!

Update your frontend's `VITE_API_URL` to point to your new Railway URL.

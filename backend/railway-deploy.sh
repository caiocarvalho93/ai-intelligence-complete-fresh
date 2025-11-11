#!/bin/bash

# Railway Deployment Script
# This script helps you set environment variables on Railway

echo "🚂 Railway Deployment Helper"
echo "================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g @railway/cli"
    echo "  or"
    echo "  brew install railway"
    echo ""
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    railway login
fi

echo ""
echo "📋 Current Railway project:"
railway status
echo ""

# Prompt for MongoDB credentials
echo "🔑 MongoDB Atlas Credentials"
echo "----------------------------"
read -p "Enter MongoDB Username: " MONGO_USER
read -sp "Enter MongoDB Password: " MONGO_PASS
echo ""

# Build MongoDB URI
MONGODB_URI="mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cai-newsdb.zrddgt8.mongodb.net/?retryWrites=true&w=majority&appName=cai-newsdb"

echo ""
echo "🚀 Setting environment variables on Railway..."
echo ""

# Set all required variables
railway variables set MONGODB_URI="$MONGODB_URI"
railway variables set DATABASE_URL="postgresql://postgres:ylQFKAOHIAJlNvOciiXAPbFuPThxzTxX@ballast.proxy.rlwy.net:49633/railway"
railway variables set NEWS_API_KEY="80880b6ccb1859033d4d0df5064fb12e"
railway variables set NEWSDATA_API_KEY="80880b6ccb1859033d4d0df5064fb12e"
railway variables set NEWS_API_KEY_FALLBACK="pub_da3a034d1d0e419892ff9574f0262f4c"
railway variables set ALLOWED_ORIGIN="https://website-project-ai.vercel.app"
railway variables set NODE_ENV="production"
railway variables set PORT="8080"
railway variables set OPENAI_API_KEY="your_openai_api_key_here"
railway variables set GROK_API_KEY="your_grok_api_key_here"
railway variables set ALPHA_VANTAGE_API_KEY="VQZ228GQKHENOZDD"
railway variables set PRIVATE_KEY="9bf51c1fed26b2770cb0ad0a86903fd962282ff63795e9442a96a53fb637e226"
railway variables set RPC_URL="https://bsc-dataseed.binance.org/"

echo ""
echo "✅ All variables set!"
echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Check your deployment:"
echo "  railway logs"
echo ""
echo "🌐 Open your app:"
echo "  railway open"

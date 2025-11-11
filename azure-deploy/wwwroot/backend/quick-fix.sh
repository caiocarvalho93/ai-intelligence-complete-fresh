#!/bin/bash

echo "🚀 QUICK FIX - Railway Deployment"
echo "=================================="
echo ""
echo "Choose your option:"
echo ""
echo "1) Deploy WITH MongoDB (you need MongoDB credentials)"
echo "2) Deploy WITHOUT MongoDB (PostgreSQL only - FASTEST)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "2" ]; then
    echo ""
    echo "🔧 Switching to PostgreSQL-only mode..."
    
    # Backup current server.js
    cp server.js server.js.backup
    
    # Use PostgreSQL-only server
    cp server-postgres-only.js server-mongodb.js
    
    echo "✅ Server configured for PostgreSQL only"
    echo ""
    echo "🚀 Deploying to Railway..."
    
    # Link to Railway project if not linked
    railway link
    
    # Deploy
    railway up
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📊 Check logs:"
    echo "  railway logs"
    echo ""
    echo "🌐 Open app:"
    echo "  railway open"
    
elif [ "$choice" = "1" ]; then
    echo ""
    read -p "MongoDB Username: " MONGO_USER
    read -sp "MongoDB Password: " MONGO_PASS
    echo ""
    
    MONGODB_URI="mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cai-newsdb.zrddgt8.mongodb.net/?retryWrites=true&w=majority&appName=cai-newsdb"
    
    echo ""
    echo "🚀 Setting MongoDB URI on Railway..."
    railway variables set MONGODB_URI="$MONGODB_URI"
    
    echo "✅ MongoDB configured!"
    echo ""
    echo "🚀 Deploying to Railway..."
    railway up
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📊 Check logs:"
    echo "  railway logs"
else
    echo "Invalid choice. Exiting."
    exit 1
fi

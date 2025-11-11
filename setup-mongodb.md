# 🗄️ MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://cloud.mongodb.com
2. Sign up for a free account
3. Verify your email

## Step 2: Create Your Cluster

1. **Create New Project**:
   - Project Name: `AI Intelligence Network`
   - Click "Create Project"

2. **Build a Database**:
   - Choose "M0 FREE" (512 MB storage)
   - Provider: AWS (recommended)
   - Region: Choose closest to your Azure region
   - Cluster Name: `ai-intelligence-cluster`
   - Click "Create"

## Step 3: Create Database User

1. **Database Access** → **Add New Database User**:
   - Authentication Method: Password
   - Username: `caitripping_db_user`
   - Password: Generate secure password (save this!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

## Step 4: Configure Network Access

1. **Network Access** → **Add IP Address**:
   - For development: Add your current IP
   - For Azure deployment: Add `0.0.0.0/0` (allow from anywhere)
   - Click "Confirm"

## Step 5: Get Connection String

1. **Clusters** → **Connect** → **Connect your application**
2. **Driver**: Node.js
3. **Version**: 4.1 or later
4. Copy the connection string:
   ```
   mongodb+srv://caitripping_db_user:<password>@ai-intelligence-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your Environment

Add to your `.env` file:
```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://caitripping_db_user:YOUR_PASSWORD_HERE@ai-intelligence-cluster.xxxxx.mongodb.net/ai_intelligence_network?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD_HERE` with your actual password
- `xxxxx` with your actual cluster ID
- `ai_intelligence_network` is your database name

## Step 7: Test Connection

Run the migration script to test:
```bash
npm run migrate
```

## 🔒 Security Notes

- **Never commit your password to Git**
- **Use environment variables only**
- **Enable MongoDB Atlas encryption**
- **Use IP whitelisting in production**

## 💰 Cost Information

- **M0 Free Tier**: 512MB storage, shared RAM and vCPU
- **Upgrade Path**: M2 ($9/month) for dedicated resources
- **No credit card required** for free tier

Your connection string will look like:
```
mongodb+srv://caitripping_db_user:SecurePassword123@ai-intelligence-cluster.abc123.mongodb.net/ai_intelligence_network?retryWrites=true&w=majority
```
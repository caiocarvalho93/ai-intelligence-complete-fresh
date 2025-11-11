# 🚀 Deploy CAI News - Complete Guide

## ✅ Railway Backend - DEPLOYED!

Your backend is **LIVE** at:
**https://grand-forgiveness-production.up.railway.app**

### Test Backend
```bash
curl https://grand-forgiveness-production.up.railway.app/health
```

Expected response:
```json
{
  "ok": true,
  "service": "AI Intelligence Network",
  "status": "OPERATIONAL",
  "database": {"type": "PostgreSQL Railway", "status": "connected"}
}
```

## 📦 Vercel Frontend - Deploy Now

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import Git Repository**:
   - Select: `caiocarvalho93/cainews`
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as is)
   
4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   ```
   VITE_API_URL=https://grand-forgiveness-production.up.railway.app
   ```

6. **Click "Deploy"**

### Option 2: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **cainews** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **N**

## 🔧 Post-Deployment Configuration

### Update Railway CORS

After Vercel deployment, update Railway to allow your Vercel domain:

```bash
# Get your Vercel URL (e.g., cainews.vercel.app)
# Then set it on Railway:
railway variables --set "ALLOWED_ORIGIN=https://cainews.vercel.app"
```

Or via Railway Dashboard:
1. Go to your Railway project
2. Click on your service
3. Go to "Variables"
4. Update `ALLOWED_ORIGIN` to your Vercel URL

## ✅ Verification Checklist

### Backend (Railway)
- [ ] Health endpoint responds: `/health`
- [ ] Database connected
- [ ] Environment variables set
- [ ] Logs show no errors

### Frontend (Vercel)
- [ ] Site loads successfully
- [ ] Can fetch news from backend
- [ ] No CORS errors in console
- [ ] All pages work

### Integration
- [ ] Frontend can call backend API
- [ ] News feed displays articles
- [ ] Translation works
- [ ] No console errors

## 🌐 Your Deployed URLs

### Backend (Railway)
```
Production: https://grand-forgiveness-production.up.railway.app
Health Check: https://grand-forgiveness-production.up.railway.app/health
API Base: https://grand-forgiveness-production.up.railway.app/api
```

### Frontend (Vercel)
```
Production: https://cainews.vercel.app (or your custom domain)
```

## 🔍 Testing Your Deployment

### Test Backend API
```bash
# Health check
curl https://grand-forgiveness-production.up.railway.app/health

# Get news
curl https://grand-forgiveness-production.up.railway.app/api/global-news

# Test translation
curl "https://grand-forgiveness-production.up.railway.app/api/translation/translate?text=hello&to=es"
```

### Test Frontend
1. Open your Vercel URL in browser
2. Check browser console for errors
3. Try fetching news
4. Test navigation between pages
5. Verify translation works

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors:
1. Check `ALLOWED_ORIGIN` in Railway matches your Vercel URL
2. Ensure no trailing slash in URLs
3. Restart Railway service after changing variables

### Build Failures on Vercel
1. Check build logs in Vercel dashboard
2. Ensure `package.json` has correct scripts
3. Verify all dependencies are listed
4. Check Node version compatibility

### Backend Not Responding
1. Check Railway logs: `railway logs`
2. Verify environment variables are set
3. Check database connection
4. Restart service if needed

## 📊 Monitor Your Deployment

### Railway Monitoring
```bash
# View logs
railway logs --follow

# Check status
railway status

# View metrics
railway open  # Opens dashboard
```

### Vercel Monitoring
1. Go to Vercel Dashboard
2. Select your project
3. View:
   - Deployment logs
   - Analytics
   - Performance metrics
   - Error tracking

## 🔄 Future Deployments

### Update Backend (Railway)
```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Railway auto-deploys from GitHub
```

### Update Frontend (Vercel)
```bash
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys from GitHub
```

## 🎯 Quick Commands

```bash
# Check Railway deployment
railway logs --tail 50

# Check Railway status
railway status

# Open Railway dashboard
railway open

# Deploy to Vercel
vercel --prod

# Check Vercel deployments
vercel ls
```

## 🔐 Security Checklist

- [ ] API keys are in environment variables (not in code)
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on Railway & Vercel)
- [ ] Database credentials are secure
- [ ] No sensitive data in logs

## 📈 Performance Tips

### Backend (Railway)
- Use caching for frequently accessed data
- Optimize database queries
- Enable compression
- Monitor memory usage

### Frontend (Vercel)
- Optimize images
- Use lazy loading
- Minimize bundle size
- Enable CDN caching

## 🎉 Success!

Once both are deployed:

1. ✅ Backend running on Railway
2. ✅ Frontend running on Vercel
3. ✅ Database connected
4. ✅ APIs working
5. ✅ Full integration complete

Your CAI News system is now **LIVE** and accessible worldwide!

## 📞 Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://vercel.com/discord

---

**Current Status:**
- ✅ Railway Backend: DEPLOYED
- ⏳ Vercel Frontend: Ready to deploy (follow steps above)
- ✅ Database: Connected and initialized
- ✅ Environment Variables: Configured

**Next Step:** Deploy frontend to Vercel using Option 1 or 2 above!

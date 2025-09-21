# 🚀 TripMigo - Free Deployment Guide

Complete guide to deploy TripMigo on free platforms with full functionality.

## 📋 Prerequisites

1. **GitHub Account** (free)
2. **Google Cloud Account** (with $300 free credits)
3. **Vercel Account** (free tier)
4. **Railway Account** (free tier with $5 monthly credit)

## 🔑 API Keys Setup

### 1. Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API** 
   - **Geocoding API**
   - **Generative Language API** (for Gemini)

4. Create API Keys:
   - **Maps API Key**: Go to "Credentials" → "Create Credentials" → "API Key"
   - **Gemini API Key**: Go to [AI Studio](https://aistudio.google.com/) → "Get API Key"

5. Restrict API Keys (recommended):
   - Maps API: Restrict to your domains
   - Gemini API: No restrictions needed for server use

## 🚀 Backend Deployment (Railway)

### Step 1: Prepare Repository
```bash
# Create a new GitHub repository
# Upload your entire project to GitHub
git init
git add .
git commit -m "Initial TripMigo deployment"
git branch -M main
git remote add origin https://github.com/yourusername/tripmigo.git
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to [Railway](https://railway.app/)
2. Sign up/Login with GitHub
3. Click "Deploy from GitHub repo"
4. Select your TripMigo repository
5. Choose the **backend** folder as root directory

### Step 3: Configure Environment Variables
In Railway dashboard, go to "Variables" and add:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_AI_API_KEY=your_gemini_api_key
PORT=8000
ENVIRONMENT=production
```

### Step 4: Configure Build Settings
- **Root Directory**: `/backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python main.py`

### Step 5: Get Backend URL
After deployment, Railway will provide a URL like:
`https://tripmigo-backend-production.up.railway.app`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your TripMigo repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/frontend` (if separate) or leave blank
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 2: Environment Variables
In Vercel dashboard, go to "Settings" → "Environment Variables":
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_APP_NAME=TripMigo
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

### Step 3: Deploy
- Click "Deploy"
- Vercel will provide a URL like: `https://tripmigo.vercel.app`

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings
Your backend is already configured for Vercel domains. If you get CORS errors:
1. Go to Railway dashboard
2. Add your Vercel URL to allowed origins in environment variables:
```
ALLOWED_ORIGINS=https://tripmigo.vercel.app,https://your-custom-domain.com
```

### 2. Test Functionality
Visit your deployed app and test:
- [ ] Map loading
- [ ] Location search
- [ ] Trip planning flow
- [ ] AI itinerary generation
- [ ] All navigation

## 💰 Cost Breakdown (FREE!)

### Vercel (Frontend)
- ✅ **FREE**: Unlimited personal projects
- ✅ **FREE**: 100GB bandwidth/month
- ✅ **FREE**: Automatic HTTPS
- ✅ **FREE**: Global CDN

### Railway (Backend)
- ✅ **FREE**: $5 monthly credit
- ✅ **FREE**: 500 hours execution time
- ✅ **FREE**: 1GB RAM, 1 vCPU
- ✅ **FREE**: 1GB storage

### Google Cloud APIs
- ✅ **FREE**: $300 credit for new users
- ✅ **Maps API**: $200 free monthly usage
- ✅ **Gemini API**: Free tier with generous limits

## 🎯 Custom Domain (Optional)

### Free Custom Domain Options:
1. **Freenom** (.tk, .ml, .ga domains)
2. **Vercel**: Use your own domain for free
3. **Railway**: Custom domain on free tier

## 🔍 Troubleshooting

### Common Issues:

**1. Backend not responding:**
- Check Railway logs in dashboard
- Verify environment variables
- Ensure PORT is set to Railway's dynamic port

**2. API errors:**
- Verify Google API keys are valid
- Check API quotas in Google Cloud Console
- Ensure APIs are enabled

**3. CORS errors:**
- Check CORS configuration in backend
- Verify Vercel URL in allowed origins

**4. Build failures:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **Google Cloud**: https://cloud.google.com/docs

## 🎉 Success!

Your TripMigo app should now be live and fully functional at:
- **Frontend**: https://tripmigo.vercel.app
- **Backend**: https://tripmigo-backend-production.up.railway.app

All features including AI trip planning, Google Maps integration, and user authentication should work seamlessly!

---

**Total Cost: $0/month** ✨

*With proper usage of free tiers, your TripMigo app can serve thousands of users completely free!*
# 🚀 Deployment Guide - EduNexus LMS

## 📋 Pre-Deployment Checklist

### ✅ Before Pushing to GitHub:

- [ ] All `.env` files are in `.gitignore`
- [ ] `.env.example` files are updated
- [ ] Sensitive data removed from code
- [ ] MongoDB Atlas connection string ready
- [ ] Cloudinary credentials configured
- [ ] All dependencies installed
- [ ] Code tested locally
- [ ] README.md updated

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or login
3. Create a new cluster (Free tier available)

### Step 2: Configure Database Access
1. Go to **Database Access**
2. Click **Add New Database User**
3. Username: `vishnu`
4. Password: `vishnu007`
5. Set permissions: **Read and write to any database**
6. Click **Add User**

### Step 3: Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add specific IPs for better security
4. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Database** → **Connect**
2. Select **Connect your application**
3. Copy connection string:
   ```
   mongodb+srv://vishnu:vishnu007@cluster0.gxre5nj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Add database name to the string:
   ```
   mongodb+srv://vishnu:vishnu007@cluster0.gxre5nj.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0
   ```

### ✅ Your MongoDB Atlas is Ready!

---

## 📦 GitHub Setup

### Step 1: Initialize Git Repository

```bash
cd "v:\Learning Management System (LMS)"
git init
```

### Step 2: Create `.gitignore` (Already exists)

Verify `.gitignore` includes:
```
node_modules/
.env
.env.local
.env.*.local
build/
dist/
*.log
.vscode/
.DS_Store
```

### Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **New Repository**
3. Name: `edunexus-lms` (or your choice)
4. Description: "Full-stack Learning Management System"
5. **DO NOT** initialize with README (we already have one)
6. Click **Create Repository**

### Step 4: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: EduNexus LMS with MongoDB Atlas support"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/edunexus-lms.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Environment Variables Setup

### Backend `.env` (DO NOT commit this file!)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas
MONGO_URI=mongodb+srv://vishnu:vishnu007@cluster0.gxre5nj.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d

# CORS
CLIENT_URL=https://your-frontend-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=dybcjvbwz
CLOUDINARY_API_KEY=229728139224424
CLOUDINARY_API_SECRET=_JGo6C7HxzwdKYq8YD8iE0EmX6k

# Frontend URL (for certificate QR codes)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend `.env` (DO NOT commit this file!)

```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 🌐 Deployment Options

### Option 1: Render (Recommended for Backend)

#### Backend Deployment:

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service:**
   - Connect your GitHub repository
   - Select `backend` folder as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables:**
   - Go to **Environment** tab
   - Add all variables from backend `.env`
   - Click **Save Changes**

4. **Deploy:**
   - Render will automatically deploy
   - Note your backend URL: `https://your-app.onrender.com`

#### Frontend Deployment:

1. **Create New Static Site:**
   - Connect your GitHub repository
   - Select `frontend` folder as root directory
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Add Environment Variable:**
   - `VITE_API_URL=https://your-backend.onrender.com`

3. **Deploy:**
   - Note your frontend URL: `https://your-app.onrender.com`

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Backend on Render (Same as above)

#### Frontend on Vercel:

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import Project:**
   - Connect GitHub repository
   - Select `frontend` folder
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variable:**
   - `VITE_API_URL=https://your-backend.onrender.com`

4. **Deploy:**
   - Vercel will deploy automatically
   - Note your URL: `https://your-app.vercel.app`

---

### Option 3: Railway (Full Stack)

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project:**
   - Connect GitHub repository

3. **Deploy Backend:**
   - Add service from repo
   - Select `backend` folder
   - Add environment variables
   - Railway will auto-deploy

4. **Deploy Frontend:**
   - Add another service
   - Select `frontend` folder
   - Add `VITE_API_URL` variable
   - Railway will auto-deploy

---

## 🔄 Post-Deployment Steps

### 1. Update Environment Variables

After deployment, update these in your hosting platform:

**Backend:**
```env
NODE_ENV=production
CLIENT_URL=https://your-actual-frontend-url.com
FRONTEND_URL=https://your-actual-frontend-url.com
```

**Frontend:**
```env
VITE_API_URL=https://your-actual-backend-url.com
```

### 2. Test the Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.com/api/health
   # Should return: {"status":"ok"}
   ```

2. **Test Frontend:**
   - Open your frontend URL
   - Try to sign up
   - Try to login
   - Create a course
   - Upload a video
   - Download certificate

### 3. Update Certificate QR Codes

Certificates will now use your production URL automatically!

---

## 🔒 Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use strong database password
- [ ] Enable MongoDB Atlas IP whitelist (remove 0.0.0.0/0)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Review CORS settings
- [ ] Check all API endpoints are protected
- [ ] Test authentication flow
- [ ] Verify file upload limits
- [ ] Check rate limiting (if implemented)

---

## 📊 Monitoring

### MongoDB Atlas Monitoring:
1. Go to your cluster
2. Click **Metrics**
3. Monitor:
   - Database connections
   - Operations per second
   - Storage usage

### Application Logs:
- **Render**: View logs in dashboard
- **Vercel**: View logs in deployment details
- **Railway**: View logs in service details

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
```
Error: MongooseServerSelectionError
```

**Solutions:**
1. Check MongoDB Atlas IP whitelist
2. Verify connection string is correct
3. Ensure database user has correct permissions
4. Check if cluster is active

### Issue 2: CORS Error
```
Access to fetch has been blocked by CORS policy
```

**Solutions:**
1. Update `CLIENT_URL` in backend `.env`
2. Verify CORS middleware is configured
3. Check frontend URL matches exactly

### Issue 3: Environment Variables Not Working
```
undefined or null values
```

**Solutions:**
1. Verify variables are set in hosting platform
2. Restart the service after adding variables
3. Check variable names match exactly (case-sensitive)
4. For Vite, variables must start with `VITE_`

### Issue 4: Build Fails
```
npm ERR! code ELIFECYCLE
```

**Solutions:**
1. Check `package.json` scripts
2. Verify all dependencies are in `package.json`
3. Clear cache: `npm cache clean --force`
4. Delete `node_modules` and reinstall

### Issue 5: Video Upload Fails
```
Cloudinary upload error
```

**Solutions:**
1. Verify Cloudinary credentials
2. Check file size limits
3. Ensure multer is configured correctly
4. Check Cloudinary quota

---

## 🔄 Continuous Deployment

### Automatic Deployment on Push:

Most platforms (Render, Vercel, Railway) automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# Platform will automatically:
# 1. Detect the push
# 2. Pull latest code
# 3. Install dependencies
# 4. Build the project
# 5. Deploy
```

---

## 📝 Deployment Checklist

### Before First Deployment:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string tested
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] `.env` files not committed
- [ ] `.env.example` files updated

### During Deployment:
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] URLs updated in configs
- [ ] CORS configured
- [ ] Database connected

### After Deployment:
- [ ] Test signup/login
- [ ] Test course creation
- [ ] Test video upload
- [ ] Test certificate download
- [ ] Test QR code verification
- [ ] Monitor logs for errors
- [ ] Check database connections

---

## 🎯 Quick Start Commands

### Push to GitHub:
```bash
git add .
git commit -m "Update: [your message]"
git push origin main
```

### Update Environment Variables:
```bash
# In your hosting platform dashboard:
# 1. Go to Environment Variables
# 2. Update the variable
# 3. Save
# 4. Redeploy (usually automatic)
```

### View Logs:
```bash
# Render
# Go to dashboard → Logs tab

# Vercel
# Go to deployment → View Function Logs

# Railway
# Go to service → View Logs
```

---

## 🆘 Getting Help

### Resources:
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)

### Common Commands:
```bash
# Check MongoDB connection
node -e "require('./backend/src/config/database.js')"

# Test backend locally
cd backend && npm run dev

# Test frontend locally
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build

# Check for errors
npm run lint
```

---

## ✅ Success Indicators

You know deployment is successful when:

1. ✅ Backend health check returns 200
2. ✅ Frontend loads without errors
3. ✅ Can sign up new users
4. ✅ Can login successfully
5. ✅ Can create courses
6. ✅ Can upload videos
7. ✅ Can download certificates
8. ✅ QR codes work with production URL
9. ✅ No CORS errors
10. ✅ MongoDB Atlas shows connections

---

## 🎉 You're Live!

Your EduNexus LMS is now deployed and accessible worldwide!

**Next Steps:**
1. Share your URL with users
2. Monitor usage and performance
3. Collect feedback
4. Plan new features
5. Keep dependencies updated

**Congratulations! 🎓**

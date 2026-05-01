# Deployment & GitHub Push Guide

This guide will walk you through pushing your project to GitHub and deploying it to Railway (backend) and Netlify (frontend).

## Part 1: Push Project to GitHub

### Step 1: Initialize Git Repository Locally

```bash
# Navigate to project root
cd c:\Users\abc\Desktop\entharaAssesment

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MERN project management app"
```

### Step 2: Add Remote Repository

```bash
# Add GitHub remote repository
git remote add origin https://github.com/dev-raman-k/entharaAssesment.git

# Verify remote
git remote -v
```

### Step 3: Push to GitHub

```bash
# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### Step 4: Verify on GitHub

- Go to https://github.com/dev-raman-k/entharaAssesment
- Verify all files are present
- Check .gitignore is working (node_modules, .env should not be visible)

---

## Part 2: Deploy Backend on Railway

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub account
3. Authorize Railway to access your GitHub

### Step 2: Create New Project on Railway

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Search for "entharaAssesment"
4. Click "Deploy"

### Step 3: Configure Environment Variables

1. In Railway dashboard, go to your project
2. Click on the service
3. Navigate to "Variables" tab
4. Add the following environment variables:

```
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/enthara_assessment
JWT_SECRET=your_secure_jwt_secret_key_here_change_this
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-netlify-url.netlify.app
```

**Important:** Replace credentials with your actual MongoDB Atlas credentials

### Step 4: MongoDB Atlas Setup (if not already done)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist IP (click "Allow Access from Anywhere")
6. Copy connection string:
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/enthara_assessment`
7. Use this in Railway variables

### Step 5: Deploy Backend

1. Railway should automatically detect server.js
2. Click "Deploy" or it deploys automatically
3. Wait for deployment to complete
4. Copy the Railway URL (e.g., https://entharaassesment-production.railway.app)
5. This is your `REACT_APP_API_URL` for frontend

### Step 6: Test Backend

```bash
# Test health endpoint
curl https://your-railway-url/api/health

# Should return: {"success":true,"message":"Server is running"}
```

---

## Part 3: Deploy Frontend on Netlify

### Step 1: Create Netlify Account

1. Go to https://netlify.com
2. Sign up with GitHub account
3. Authorize Netlify to access your GitHub

### Step 2: Create New Site

1. Click "New site from Git"
2. Select GitHub
3. Search and select "entharaAssesment" repository
4. Click "Deploy site"

### Step 3: Configure Build Settings

**Auto-populated, but verify:**
- Build command: `npm run build`
- Publish directory: `build`
- Functions directory: (leave blank)
- Base directory: `frontend`

### Step 4: Set Environment Variables

1. In Netlify dashboard, go to Site settings
2. Click "Build & deploy" > "Environment"
3. Click "Edit variables"
4. Add variable:
   ```
   REACT_APP_API_URL = https://your-railway-backend-url
   ```
   (Example: `https://entharaassesment-production.railway.app/api`)

### Step 5: Deploy Frontend

1. Click "Deploy site"
2. Wait for build to complete (usually 1-2 minutes)
3. You'll get a Netlify URL (e.g., https://[random-name].netlify.app)
4. Update Railway FRONTEND_URL variable with this URL

### Step 6: Enable Auto-Deploys

- Netlify auto-deploys on every push to main branch by default
- Check "Deployments" tab for deployment history

---

## Part 4: Post-Deployment Configuration

### Step 1: Update CORS

If you get CORS errors, update backend CORS settings:

**File:** `backend/server.js`

```javascript
app.use(cors({
  origin: 'https://your-netlify-url.netlify.app',
  credentials: true,
}));
```

### Step 2: Test Full Application

1. Open your Netlify frontend URL
2. Register a new account
3. Login
4. Create a project
5. Create a task
6. Verify dashboard loads data

### Step 3: Monitor Deployments

**Railway:**
- Go to https://railway.app
- Check logs in real-time
- Monitor deployment status

**Netlify:**
- Go to https://netlify.com
- Check build logs
- Monitor deployment status

---

## Part 5: Continuous Deployment

### Automatic Deployments

Both Railway and Netlify watch your GitHub repository:

1. Make changes locally
2. Commit changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```
4. Railway & Netlify automatically deploy within minutes

### Manual Redeploy

**Railway:**
- Go to your service
- Click "Redeploy" button

**Netlify:**
- Go to Deployments
- Click "Trigger deploy" > "Deploy site"

---

## Part 6: Troubleshooting

### Backend Not Connecting

1. Check CORS configuration
2. Verify REACT_APP_API_URL in Netlify variables
3. Check Railway logs for errors
4. Ensure MongoDB connection string is correct

### Frontend Build Fails

1. Check Netlify build logs
2. Verify base directory is set to "frontend"
3. Ensure all dependencies are in frontend/package.json
4. Clear Netlify cache and redeploy

### CORS Errors

1. Update FRONTEND_URL in Railway
2. Update origin in backend/server.js
3. Clear browser cache
4. Redeploy both services

### MongoDB Connection Issues

1. Whitelist all IPs in MongoDB Atlas
2. Verify username and password (special characters need encoding)
3. Ensure database name matches connection string
4. Test connection locally first

---

## Part 7: Domain Setup (Optional)

### Add Custom Domain on Netlify

1. Go to Site settings > Domain settings
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS configuration steps
5. DNS propagation takes 24-48 hours

### Add Custom Domain on Railway

1. Go to your project > Networking
2. Click "Add custom domain"
3. Follow DNS configuration steps

---

## Part 8: Production Checklist

Before going live:

- [ ] Test all authentication flows
- [ ] Verify role-based access works
- [ ] Test project creation and team management
- [ ] Test task assignment and status updates
- [ ] Verify dashboard displays correct data
- [ ] Check all API endpoints work
- [ ] Test on different browsers
- [ ] Check mobile responsiveness
- [ ] Verify error handling
- [ ] Monitor application logs

---

## Important Security Notes

⚠️ **CRITICAL:**
- Never commit `.env` files to GitHub
- Use strong JWT_SECRET (minimum 32 characters)
- Enable MongoDB user authentication
- Whitelist only necessary IPs in MongoDB
- Use HTTPS for all connections
- Keep dependencies updated
- Monitor logs regularly

---

## Useful Commands

```bash
# Local development
cd backend && npm run dev        # Start backend
cd frontend && npm start          # Start frontend

# Git commands
git status                        # Check status
git log                           # View commit history
git push origin main              # Push to GitHub
git pull origin main              # Pull from GitHub

# Production builds
cd frontend && npm run build      # Build frontend for production

# Environment setup
copy .env.example .env            # Create .env from template
```

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
- GitHub: https://docs.github.com

---

## Next Steps

1. Follow this guide step-by-step
2. Test deployments thoroughly
3. Monitor application performance
4. Set up monitoring and alerts
5. Plan for scaling if needed

Your application is now ready for production! 🚀

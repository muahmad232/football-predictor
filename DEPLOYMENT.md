# 🚀 Render Deployment Guide for FIFA Prediction App

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Handling Large Model Files](#handling-large-model-files)
3. [Deployment Steps](#deployment-steps)
4. [Alternative Deployment Methods](#alternative-deployment-methods)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Git](https://git-scm.com/) installed
- [Git LFS](https://git-lfs.github.com/) installed
- GitHub account
- Render account (free tier available at [render.com](https://render.com))

---

## Handling Large Model Files

Your ML model files (`.pkl`, `.npy`, `.csv`) are likely too large for standard Git. We'll use **Git LFS**.

### Step 1: Install Git LFS

**Windows:**
```powershell
# Using Chocolatey
choco install git-lfs

# Or download from: https://git-lfs.github.com/
```

**Mac:**
```bash
brew install git-lfs
```

**Linux:**
```bash
sudo apt-get install git-lfs
```

### Step 2: Initialize Git LFS

```powershell
# Navigate to your project
cd "e:\Data Science projects\Fifa Website"

# Initialize Git LFS
git lfs install

# Verify .gitattributes file exists (already created)
# It should contain:
# *.pkl filter=lfs diff=lfs merge=lfs -text
# *.npy filter=lfs diff=lfs merge=lfs -text
# *.csv filter=lfs diff=lfs merge=lfs -text
```

---

## Deployment Steps

### Method 1: Blueprint Deployment (Recommended) ✨

This uses the `render.yaml` file to deploy both frontend and backend automatically.

#### Step 1: Create GitHub Repository

```powershell
# Initialize Git repository
git init

# Add all files
git add .

# Commit (Git LFS will track large files automatically)
git commit -m "Initial commit: FIFA prediction app with LFS models"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/fifa-prediction-app.git
git branch -M main
git push -u origin main
```

**Important**: Git LFS on GitHub free tier has limits:
- 1 GB storage
- 1 GB bandwidth/month

If your models exceed this, see [Alternative Methods](#alternative-deployment-methods).

#### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**

2. **Click "New +" → "Blueprint"**

3. **Connect your GitHub repository**
   - Authorize Render to access your GitHub
   - Select your repository

4. **Render will detect `render.yaml`**
   - It will create 2 services automatically:
     - `fifa-prediction-backend` (Web Service)
     - `fifa-prediction-frontend` (Static Site)

5. **Configure Environment Variables**
   
   For **Backend Service**:
   - `NODE_ENV`: `production`
   - `PORT`: `5001` (auto-set)
   
   For **Frontend Service**:
   - `REACT_APP_API_URL`: (Will be auto-set to backend URL)

6. **Click "Apply"**

7. **Wait for deployment** (5-10 minutes)
   - Backend will install Node.js dependencies + Python packages
   - Frontend will build the React app

#### Step 3: Verify Deployment

Once deployed, you'll get two URLs:
- **Backend**: `https://fifa-prediction-backend.onrender.com`
- **Frontend**: `https://fifa-prediction-frontend.onrender.com`

Test the backend health:
```bash
curl https://fifa-prediction-backend.onrender.com/health
```

---

### Method 2: Manual Deployment (If Models Are Too Large)

If your models exceed GitHub LFS limits, deploy without models first, then upload them.

#### Step 1: Deploy Without Models

```powershell
# Add models to .gitignore temporarily
echo "backend/models/*.pkl" >> .gitignore
echo "backend/models/*.npy" >> .gitignore
echo "backend/models/*.csv" >> .gitignore

# Commit and push
git add .
git commit -m "Deploy without models"
git push
```

#### Step 2: Upload Models via Render Shell

After deployment:

1. Go to your backend service in Render Dashboard
2. Click "Shell" tab
3. Upload models using one of these methods:

**Option A: Using Render Disk (Persistent Storage)**
```bash
# In Render Shell
cd backend/models

# Upload via SFTP or use wget/curl if models are hosted elsewhere
# Example:
wget https://your-storage.com/models/model1.pkl
wget https://your-storage.com/models/model2.npy
```

**Option B: Use External Storage (S3, Google Cloud, Dropbox)**

Update your Python scripts to download models from cloud storage on first run:

```python
import os
import requests

def ensure_models():
    models_dir = os.path.join(os.path.dirname(__file__), '../models')
    model_files = [
        'best_xgb_regr_oerall.pkl',
        'scaled_attributes.npy',
        # ... other files
    ]
    
    for model_file in model_files:
        local_path = os.path.join(models_dir, model_file)
        if not os.path.exists(local_path):
            print(f"Downloading {model_file}...")
            url = f"https://your-storage-url/{model_file}"
            response = requests.get(url)
            with open(local_path, 'wb') as f:
                f.write(response.content)
```

---

## Alternative Deployment Methods

### Option 3: Use Render Disk for Persistent Storage

1. **Add a Disk to your backend service**:
   - In Render Dashboard → Your Backend Service → Settings
   - Scroll to "Disks"
   - Click "Add Disk"
   - Name: `models-disk`
   - Mount Path: `/app/backend/models`
   - Size: Choose based on your model size

2. **Upload models manually** using Render Shell or SFTP

### Option 4: Use Cloud Storage (AWS S3, Google Cloud Storage)

Best for very large models or multiple environments.

**Setup**:
1. Upload models to S3/GCS
2. Add download script to your backend
3. Set environment variables for storage credentials

---

## Configuration Files Explanation

### render.yaml
Defines your services and how to build them.

```yaml
services:
  - type: web
    name: fifa-prediction-backend
    runtime: node
    buildCommand: cd backend && npm install && pip install -r ../requirements.txt
    startCommand: cd backend && node server.js
```

### requirements.txt
Python dependencies for ML models.

### .gitattributes
Tells Git LFS which files to track.

### .gitignore
Files to exclude from Git (node_modules, .env, etc.)

---

## Environment Variables

### Backend (`fifa-prediction-backend`)
```
NODE_ENV=production
PORT=5001
```

### Frontend (`fifa-prediction-frontend`)
```
REACT_APP_API_URL=https://fifa-prediction-backend.onrender.com
```

---

## Troubleshooting

### Problem: "Git LFS quota exceeded"

**Solution**: Use Method 2 (Manual Deployment) or upgrade GitHub LFS quota.

### Problem: "Python module not found"

**Solution**: Check `requirements.txt` has all dependencies:
```txt
pandas==2.2.0
numpy==1.26.4
scikit-learn==1.4.0
joblib==1.3.2
```

### Problem: "Build failed: pip not found"

**Solution**: Render should have Python pre-installed. If not, add to `render.yaml`:
```yaml
buildCommand: |
  cd backend
  apt-get update && apt-get install -y python3 python3-pip
  npm install
  pip3 install -r ../requirements.txt
```

### Problem: "CORS errors"

**Solution**: Update `backend/server.js` CORS config:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Problem: "Frontend can't connect to backend"

**Solution**: Check `REACT_APP_API_URL` environment variable is set correctly in Render.

### Problem: "Service keeps sleeping (free tier)"

**Solution**: 
- Render free tier sleeps after 15 min of inactivity
- Consider upgrading to paid tier for 24/7 availability
- Or use a service like [UptimeRobot](https://uptimerobot.com/) to ping your app

---

## Post-Deployment Checklist

- [ ] Both services deployed successfully
- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without errors
- [ ] API calls work (test prediction)
- [ ] Models are loaded correctly
- [ ] Similar players feature works
- [ ] No CORS errors in browser console

---

## Monitoring & Logs

**View Logs**:
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab

**Common Issues in Logs**:
- `ENOENT: no such file or directory` → Models not uploaded
- `ModuleNotFoundError` → Python dependencies missing
- `Port already in use` → Check PORT environment variable

---

## Updating Your Deployment

```powershell
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# Render will automatically redeploy
```

---

## Cost Estimate

**Free Tier** (per service):
- 750 hours/month
- Sleeps after 15 min inactivity
- 512 MB RAM
- Perfect for testing!

**Starter Plan**: $7/month per service
- Always on (no sleeping)
- 1 GB RAM

For production with 2 services: ~$14/month

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Git LFS Documentation](https://git-lfs.github.com/)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Static Sites on Render](https://render.com/docs/deploy-create-react-app)

---

## Need Help?

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test locally first: `npm run dev`
4. Check GitHub repository has all files
5. Verify Git LFS tracked files: `git lfs ls-files`

---

**Ready to deploy?** Follow [Method 1](#method-1-blueprint-deployment-recommended) for the easiest setup!

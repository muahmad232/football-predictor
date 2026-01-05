# 🎮 Quick Start Guide - FIFA Prediction App Deployment

## TL;DR - Deploy in 5 Steps

```powershell
# Step 1: Setup (run once)
cd "e:\Data Science projects\Fifa Website"
.\setup-deploy.ps1

# Step 2: Create GitHub repo at https://github.com/new

# Step 3: Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/fifa-prediction.git
git branch -M main
git push -u origin main

# Step 4: Deploy on Render
# Go to https://dashboard.render.com
# Click "New +" → "Blueprint" → Connect your repo

# Step 5: Done! 🎉
# Your app will be live in ~10 minutes
```

---

## 📋 What Was Created

Your project now has these deployment files:

| File | Purpose |
|------|---------|
| `render.yaml` | Tells Render how to deploy your app |
| `requirements.txt` | Python ML dependencies |
| `.gitattributes` | Tracks large model files with Git LFS |
| `.gitignore` | Files to exclude from Git |
| `backend/.env.example` | Backend environment variables template |
| `frontend/.env.example` | Frontend environment variables template |
| `DEPLOYMENT.md` | Full deployment guide |
| `DEPLOYMENT-CHECKLIST.md` | Step-by-step checklist |
| `setup-deploy.ps1` | Automated setup script |

---

## 🚨 Important: Model Files

Your model files (`.pkl`, `.npy`, `.csv`) are **large**. We use **Git LFS** to handle them.

### If models are < 1GB total:
✅ Use Git LFS (already configured)
```powershell
git lfs install
git add .
git commit -m "Add models with LFS"
git push
```

### If models are > 1GB total:
❌ GitHub LFS free tier has 1GB limit

**Solution**: Deploy code first, upload models separately:
```powershell
# Exclude models from Git
echo "backend/models/*.pkl" >> .gitignore
echo "backend/models/*.npy" >> .gitignore

git add .
git push
```

Then upload models via:
1. Render Shell (after deployment)
2. Render Disk (persistent storage)
3. Cloud storage (S3, Google Cloud)

See `DEPLOYMENT.md` for detailed instructions.

---

## 🔧 Configuration

### Backend Environment Variables (on Render)
```
NODE_ENV=production
PORT=5001
```

### Frontend Environment Variables (on Render)
```
REACT_APP_API_URL=<your-backend-url-from-render>
```

**Note**: Render auto-fills the backend URL for you!

---

## 🧪 Testing Locally First

Always test before deploying:

```powershell
# Terminal 1 - Backend
cd backend
npm install
npm start
# Should run on http://localhost:5001

# Terminal 2 - Frontend
cd frontend
npm install
npm start
# Should run on http://localhost:3000

# Terminal 3 - Test prediction
curl -X POST http://localhost:5001/api/predict/outfield -H "Content-Type: application/json" -d "{...}"
```

---

## 📊 Project Structure

```
fifa-website/
├── backend/
│   ├── controllers/       # API logic
│   ├── routes/           # API routes
│   ├── scripts/          # Python ML scripts
│   ├── models/           # ML model files (LFS)
│   ├── server.js         # Express server
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── config/       # API config
│   │   └── styles/       # CSS
│   ├── public/           # Static files
│   └── package.json      # Frontend dependencies
├── render.yaml           # Render config
├── requirements.txt      # Python dependencies
└── .gitattributes        # Git LFS config
```

---

## 🐛 Common Issues & Fixes

### Issue: "Git LFS quota exceeded"
**Fix**: Use manual upload method (see DEPLOYMENT.md)

### Issue: "Build failed: pip not found"
**Fix**: Already handled in `render.yaml` build command

### Issue: "CORS error in browser"
**Fix**: Backend already configured with CORS

### Issue: "Frontend can't reach backend"
**Fix**: Check `REACT_APP_API_URL` is set correctly in Render

### Issue: "Service sleeping after 15 min"
**Fix**: Normal for free tier. Upgrade to Starter ($7/month) for 24/7

---

## 💰 Cost

**Free Tier** (Perfect for testing):
- ✅ 750 hours/month
- ✅ Unlimited projects
- ⚠️  Sleeps after 15min inactivity
- ⚠️  512MB RAM

**Starter Plan** ($7/month per service):
- ✅ Always on (no sleeping)
- ✅ 1GB RAM
- ✅ Better performance

**Your app needs 2 services**: Backend + Frontend
- Free: $0 (with sleep)
- Starter: $14/month (always on)

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **GitHub New Repo**: https://github.com/new
- **Git LFS**: https://git-lfs.github.com/
- **Render Docs**: https://render.com/docs
- **Full Guide**: See `DEPLOYMENT.md` in this project

---

## 🎯 Quick Commands Reference

```powershell
# Check Git status
git status

# Check Git LFS files
git lfs ls-files

# Check model sizes
Get-ChildItem -Path "backend\models" -Include *.pkl,*.npy,*.csv -Recurse | Select-Object Name,Length

# Install dependencies
npm run install-all

# Run locally
npm run dev

# Build frontend
cd frontend && npm run build

# View Render logs
# Go to Render Dashboard → Your Service → Logs tab
```

---

## 🚀 Ready to Deploy?

1. **Run setup script**:
   ```powershell
   .\setup-deploy.ps1
   ```

2. **Follow the prompts**

3. **Push to GitHub**

4. **Connect to Render**

5. **Watch it deploy** ☕

That's it! Your app will be live in ~10 minutes.

---

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed guide
2. Use `DEPLOYMENT-CHECKLIST.md` to track progress
3. Check Render logs for errors
4. Verify all files are in Git: `git status`

---

**Good luck with your deployment! 🎉**

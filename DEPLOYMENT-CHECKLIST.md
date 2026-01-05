# 🎯 Render Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment Checklist

### Local Setup
- [ ] Git is installed (`git --version`)
- [ ] Git LFS is installed (`git lfs version`)
- [ ] Node.js 18+ is installed (`node --version`)
- [ ] Python 3.9+ is installed (`python --version`)
- [ ] All dependencies work locally:
  - [ ] `cd backend && npm install`
  - [ ] `cd frontend && npm install`
  - [ ] `pip install -r requirements.txt`
- [ ] App runs locally without errors:
  - [ ] Backend: `cd backend && npm start`
  - [ ] Frontend: `cd frontend && npm start`
  - [ ] Test predictions work

### Project Files
- [ ] `.gitattributes` exists (tracks LFS files)
- [ ] `.gitignore` exists (excludes node_modules, .env)
- [ ] `requirements.txt` exists (Python dependencies)
- [ ] `render.yaml` exists (deployment config)
- [ ] `backend/.env.example` exists
- [ ] `frontend/.env.example` exists
- [ ] `README.md` exists
- [ ] `DEPLOYMENT.md` exists

### Code Updates
- [ ] Backend uses environment variables (`process.env.PORT`)
- [ ] Frontend uses API config (`src/config/api.js`)
- [ ] No hardcoded `localhost` URLs in production code
- [ ] CORS is properly configured
- [ ] Error handling is implemented

### Model Files
- [ ] All model files are in `backend/models/`
- [ ] Model files are tracked by Git LFS:
  - [ ] `*.pkl` files
  - [ ] `*.npy` files
  - [ ] `*.csv` files
- [ ] Total model size < 1GB (GitHub LFS free tier) OR plan for alternative upload
- [ ] Python scripts can load models from correct path

## GitHub Setup

- [ ] GitHub account created
- [ ] New repository created on GitHub
- [ ] Repository is public (or private with Render access)
- [ ] Git LFS is initialized (`git lfs install`)
- [ ] All files committed to Git
- [ ] Git remote added (`git remote add origin <url>`)
- [ ] Code pushed to GitHub (`git push -u origin main`)
- [ ] Verify files appear on GitHub
- [ ] Verify LFS files show "Stored with Git LFS" badge

## Render Setup

### Account & Repository
- [ ] Render account created (render.com)
- [ ] GitHub account connected to Render
- [ ] Repository access granted to Render

### Backend Service
- [ ] Service name: `fifa-prediction-backend`
- [ ] Runtime: Node
- [ ] Build command correct
- [ ] Start command: `node server.js`
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5001`
- [ ] Health check path: `/health`

### Frontend Service
- [ ] Service name: `fifa-prediction-frontend`
- [ ] Type: Static Site
- [ ] Build command correct
- [ ] Publish directory: `./frontend/build`
- [ ] Environment variables set:
  - [ ] `REACT_APP_API_URL=<backend-url>`

### Deployment
- [ ] Both services created via Blueprint
- [ ] Build logs show no errors
- [ ] Backend service is "Live"
- [ ] Frontend service is "Live"
- [ ] URLs are accessible

## Post-Deployment Testing

### Backend Tests
- [ ] Backend URL loads: `https://your-backend.onrender.com`
- [ ] Health endpoint works: `/health` returns 200 OK
- [ ] Root endpoint shows API info: `/` returns JSON
- [ ] Test outfield prediction:
  ```bash
  curl -X POST https://your-backend.onrender.com/api/predict/outfield \
    -H "Content-Type: application/json" \
    -d '{"playerType":"Outfield","PAC":80,"SHO":75,...}'
  ```
- [ ] Test goalkeeper prediction:
  ```bash
  curl -X POST https://your-backend.onrender.com/api/predict/goalkeeper \
    -H "Content-Type: application/json" \
    -d '{"playerType":"GK","GK Diving":80,...}'
  ```
- [ ] No errors in backend logs

### Frontend Tests
- [ ] Frontend URL loads: `https://your-frontend.onrender.com`
- [ ] Landing page displays correctly
- [ ] Can select player type (Outfield/Goalkeeper)
- [ ] Form page loads with all attributes
- [ ] Can submit form
- [ ] Results display correctly
- [ ] Similar players appear
- [ ] No CORS errors in browser console (F12)
- [ ] No 404 errors in Network tab

### Integration Tests
- [ ] Frontend can communicate with backend
- [ ] Predictions return valid results
- [ ] All pages work (Landing → Selection → Form → Results)
- [ ] "Start Over" button works
- [ ] Mobile responsive design works

## Monitoring

- [ ] Set up uptime monitoring (optional)
- [ ] Check Render logs for errors
- [ ] Monitor response times
- [ ] Test after 15 minutes (free tier sleep check)

## Troubleshooting Checklist

If something doesn't work:

### Build Failures
- [ ] Check Render build logs for errors
- [ ] Verify `package.json` scripts are correct
- [ ] Ensure Python dependencies install correctly
- [ ] Check Node version compatibility

### Model Loading Errors
- [ ] Verify models uploaded via Git LFS
- [ ] Check file paths in Python scripts
- [ ] Test model loading in Render Shell
- [ ] Verify all model files present

### API Connection Issues
- [ ] Check `REACT_APP_API_URL` is correct
- [ ] Verify CORS configuration
- [ ] Test backend URL directly
- [ ] Check Network tab in browser DevTools

### Performance Issues
- [ ] Check if service is sleeping (free tier)
- [ ] Monitor memory usage in Render
- [ ] Optimize model loading if needed

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Add environment-specific configs
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring/analytics
- [ ] Set up error tracking (Sentry)
- [ ] Add rate limiting
- [ ] Implement caching
- [ ] Add API authentication

## Documentation

- [ ] Update README with live URLs
- [ ] Document API endpoints
- [ ] Add screenshots
- [ ] Create user guide
- [ ] Document environment variables

---

## Quick Reference

**Check Git LFS tracking:**
```bash
git lfs ls-files
```

**View backend logs:**
Render Dashboard → Backend Service → Logs

**Test backend locally:**
```bash
cd backend
npm start
# Visit http://localhost:5001
```

**Test frontend locally:**
```bash
cd frontend
npm start
# Visit http://localhost:3000
```

**Redeploy after changes:**
```bash
git add .
git commit -m "Description of changes"
git push
# Render auto-deploys
```

---

## Status

**Current Status:** [ ] Not Started / [ ] In Progress / [ ] Deployed

**Backend URL:** _______________________________________________

**Frontend URL:** _______________________________________________

**Deployed on:** _______________________________________________

**Last Updated:** _______________________________________________

---

Print this checklist and mark items as you complete them! ✅

# Deployment Instructions

## Backend Deployment on Render (Free Tier)

### Step 1: Create New Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `muahmad232/football-predictor`
4. Configure:
   - **Name**: `fifa-prediction-backend`
   - **Root Directory**: `backend`
   - **Runtime**: **Python 3**
   - **Build Command**: 
     ```bash
     pip install -r ../requirements.txt && npm install
     ```
   - **Start Command**: 
     ```bash
     node server.js
     ```
   - **Instance Type**: **Free**

### Step 2: Set Environment Variables
Add these in Render Dashboard → Environment:
- `NODE_ENV` = `production`
- `PORT` = `10000` (auto-set by Render)

### Step 3: Deploy
Click **"Create Web Service"**

Wait ~10 minutes for deployment. Your backend URL will be:
```
https://fifa-prediction-backend.onrender.com
```

---

## Frontend Deployment on Vercel (Free Tier)

### Step 1: Install Vercel CLI (Optional)
```powershell
npm install -g vercel
```

### Step 2: Deploy via GitHub
1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Import your GitHub repository: `muahmad232/football-predictor`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Set Environment Variable
In Vercel Dashboard → Settings → Environment Variables:
- **Key**: `REACT_APP_API_URL`
- **Value**: `https://fifa-prediction-backend.onrender.com` (your Render backend URL)
- **Environment**: Production, Preview, Development

### Step 4: Deploy
Click **"Deploy"**

Your frontend URL will be:
```
https://fifa-prediction.vercel.app
```

---

## Quick Deploy Commands

### Deploy Frontend from CLI:
```powershell
cd "E:\Data Science projects\Fifa Website\frontend"
vercel --prod
```

---

## Testing After Deployment

### Test Backend:
```bash
curl https://fifa-prediction-backend.onrender.com/health
```

### Test Frontend:
Visit: `https://fifa-prediction.vercel.app`

### Test Full Flow:
1. Open frontend URL
2. Select player type
3. Fill in attributes
4. Submit prediction
5. Check browser console for any CORS errors

---

## CORS Configuration

If you get CORS errors, update [backend/server.js](../backend/server.js):

```javascript
app.use(cors({
  origin: ['https://fifa-prediction.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Cost

- **Render Backend**: FREE (750 hours/month, sleeps after 15 min)
- **Vercel Frontend**: FREE (unlimited bandwidth)
- **Total**: $0/month

---

## Updating Deployments

### Update Backend:
```powershell
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys
```

### Update Frontend:
```powershell
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

---

## Important Notes

1. **First Request**: Render free tier sleeps after 15 min. First request takes ~30 seconds to wake up.
2. **Backend URL**: Update `REACT_APP_API_URL` in Vercel after you get your Render URL.
3. **CORS**: Make sure to whitelist your Vercel domain in backend CORS config.
4. **Python + Node**: Render's Python runtime includes Node.js, perfect for your hybrid backend!

---

## Troubleshooting

### Backend won't start:
- Check Render logs
- Verify Python packages install correctly
- Ensure `server.js` path is correct

### Frontend can't connect:
- Verify `REACT_APP_API_URL` is set in Vercel
- Check CORS configuration
- Test backend URL directly

### Models not loading:
- Verify Git LFS pushed correctly
- Check backend logs for model loading errors
- Ensure model files are in `backend/models/`

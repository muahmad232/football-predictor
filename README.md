# FIFA Player Prediction App

A full-stack web application that predicts FIFA player overall ratings, positions, league tiers, and finds similar players using machine learning.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js + Express
- **ML Models**: Python (scikit-learn, XGBoost)

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Running Locally

Start both frontend and backend:
```bash
npm run dev
```

Or run separately:
```bash
# Backend (Terminal 1)
cd backend && npm start

# Frontend (Terminal 2)
cd frontend && npm start
```

## Deployment to Render

### Option 1: Using Git LFS (Recommended)

1. **Install Git LFS**:
```bash
git lfs install
```

2. **Initialize Git and add files**:
```bash
git init
git add .
git commit -m "Initial commit with LFS models"
```

3. **Create GitHub repository and push**:
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

4. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and deploy both services

### Option 2: Manual Upload (Alternative)

If your models are too large for GitHub:

1. **Push code without models**:
```bash
# Add models to .gitignore
echo "backend/models/*.pkl" >> .gitignore
echo "backend/models/*.npy" >> .gitignore
echo "backend/models/*.csv" >> .gitignore

git add .
git commit -m "Initial commit without models"
git push
```

2. **Upload models to Render**:
   - After deployment, use Render Shell to upload models
   - Or use Render Disk for persistent storage

### Environment Variables on Render

Set these in Render Dashboard:

**Backend Service**:
- `NODE_ENV`: production
- `PORT`: 5001

**Frontend Service**:
- `REACT_APP_API_URL`: Your backend service URL (e.g., https://fifa-prediction-backend.onrender.com)

## Project Structure

```
├── backend/              # Express API server
│   ├── controllers/      # Request handlers
│   ├── routes/          # API routes
│   ├── scripts/         # Python ML scripts
│   └── models/          # ML models (pkl, npy, csv)
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── styles/      # CSS styles
│   └── public/          # Static assets
├── requirements.txt     # Python dependencies
└── render.yaml         # Render deployment config
```

## API Endpoints

- `POST /api/predict/outfield` - Predict outfield player stats
- `POST /api/predict/goalkeeper` - Predict goalkeeper stats

## License

ISC

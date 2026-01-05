# 🏗️ Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
│                    (Web Browser)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  RENDER FRONTEND                            │
│              (Static Site Hosting)                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React App (Production Build)               │  │
│  │                                                      │  │
│  │  • Landing Page                                      │  │
│  │  • Player Selection                                  │  │
│  │  • Attribute Form                                    │  │
│  │  • Results Display                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  URL: https://fifa-prediction-frontend.onrender.com         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls (HTTPS)
                     │ POST /api/predict/outfield
                     │ POST /api/predict/goalkeeper
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  RENDER BACKEND                             │
│               (Node.js Web Service)                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Server                       │  │
│  │                                                      │  │
│  │  • API Routes (/api/predict/*)                       │  │
│  │  • Controllers (predictController.js)                │  │
│  │  • CORS Configuration                                │  │
│  │  • Error Handling                                    │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│                 │ spawns Python processes                   │
│                 │                                           │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │         Python ML Scripts                            │  │
│  │                                                      │  │
│  │  • predict_outfield.py                               │  │
│  │  • predict_gk.py                                     │  │
│  │                                                      │  │
│  │  Uses:                                               │  │
│  │  - pandas, numpy, scikit-learn                       │  │
│  │  - joblib for model loading                          │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│                 │ loads models                              │
│                 │                                           │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │         ML Models Directory                          │  │
│  │                                                      │  │
│  │  • best_xgb_regr_oerall.pkl (OVR prediction)         │  │
│  │  • best_xgb_model.pkl (Position prediction)          │  │
│  │  • league_tier_model.pkl (League prediction)         │  │
│  │  • gk_ovr_model.pkl (GK OVR)                         │  │
│  │  • scaled_attributes.npy (Similarity)                │  │
│  │  • player_info.csv (Player database)                 │  │
│  │  • ...and more scalers/encoders                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  URL: https://fifa-prediction-backend.onrender.com          │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Outfield Player Prediction

```
User Input (Frontend)
    ↓
  [ PAC, SHO, PAS, DRI, DEF, PHY + 35 attributes ]
    ↓
POST /api/predict/outfield
    ↓
predictController.js
    ↓
spawn Python: predict_outfield.py
    ↓
┌─────────────────────────────────────┐
│  1. Load Models:                    │
│     - OVR regressor                 │
│     - Position classifier           │
│     - League tier model             │
│     - Similarity scaler             │
│                                     │
│  2. Predict OVR:                    │
│     X → Scale → XGBoost → OVR       │
│                                     │
│  3. Predict Position:               │
│     Calculate position scores       │
│     → Scale → XGBoost → Position    │
│                                     │
│  4. Predict League Tier:            │
│     OVR + Face Stats → Model        │
│     (with hybrid logic)             │
│                                     │
│  5. Find Similar Players:           │
│     Scale attributes →              │
│     Euclidean distance →            │
│     Top 5 matches                   │
└─────────────────────────────────────┘
    ↓
JSON Response
    ↓
Frontend displays results
```

### 2. Goalkeeper Prediction

```
User Input (Frontend)
    ↓
  [ GK Diving, Handling, Kicking, Positioning, Reflexes + others ]
    ↓
POST /api/predict/goalkeeper
    ↓
predictController.js
    ↓
spawn Python: predict_gk.py
    ↓
┌─────────────────────────────────────┐
│  1. Load Models:                    │
│     - GK OVR model                  │
│     - League tier model             │
│     - GK similarity scaler          │
│                                     │
│  2. Predict GK OVR:                 │
│     GK Attributes → Model → OVR     │
│                                     │
│  3. Predict League Tier:            │
│     (Same as outfield)              │
│                                     │
│  4. Find Similar GKs:               │
│     Scale GK attributes →           │
│     Euclidean distance →            │
│     Top 5 matches                   │
│                                     │
│  Position: Always "GK"              │
└─────────────────────────────────────┘
    ↓
JSON Response
    ↓
Frontend displays results
```

---

## Render Deployment Process

### Build Phase

```
┌─────────────────────────────────────┐
│  1. Clone Repository from GitHub    │
│     (with Git LFS for models)       │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│  2. Backend Build                   │
│     • cd backend                    │
│     • npm install                   │
│     • pip install -r requirements   │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│  3. Frontend Build                  │
│     • cd frontend                   │
│     • npm install                   │
│     • npm run build                 │
│     • Creates optimized bundle      │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│  4. Deploy Services                 │
│     • Backend: Node process         │
│     • Frontend: Static files        │
└─────────────────────────────────────┘
```

### Runtime Phase

```
Backend Service:
    node server.js
    ↓
    Listens on 0.0.0.0:5001
    ↓
    Handles API requests
    ↓
    Spawns Python when needed
    ↓
    Returns JSON responses

Frontend Service:
    Serves static HTML/CSS/JS
    ↓
    React app loads in browser
    ↓
    Makes AJAX calls to backend
    ↓
    Displays results
```

---

## File Structure in Deployment

### Backend Container
```
/app/
├── backend/
│   ├── node_modules/          (installed)
│   ├── controllers/
│   │   └── predictController.js
│   ├── routes/
│   │   └── predictRoutes.js
│   ├── scripts/
│   │   ├── predict_outfield.py
│   │   └── predict_gk.py
│   ├── models/                (via Git LFS)
│   │   ├── *.pkl
│   │   ├── *.npy
│   │   └── *.csv
│   ├── server.js
│   └── package.json
├── requirements.txt
└── Python packages (installed)
    ├── pandas
    ├── numpy
    ├── scikit-learn
    └── joblib
```

### Frontend Container
```
/app/frontend/build/           (production build)
├── index.html
├── static/
│   ├── css/
│   │   └── main.[hash].css
│   ├── js/
│   │   └── main.[hash].js
│   └── media/
└── manifest.json
```

---

## Environment Variables Flow

```
Render Dashboard
    ↓
Environment Variables
    ↓
┌─────────────────────────────────────────┐
│  Backend:                               │
│    NODE_ENV=production                  │
│    PORT=5001                            │
│    (Used by server.js)                  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Frontend (Build time):                 │
│    REACT_APP_API_URL=<backend-url>      │
│    (Embedded into JS bundle)            │
└─────────────────────────────────────────┘
```

---

## Git LFS Integration

```
Local Repository
    ↓
Git LFS tracks large files
    (*.pkl, *.npy, *.csv)
    ↓
git push
    ↓
┌─────────────────────────────────────┐
│  GitHub:                            │
│    • Code stored normally           │
│    • Large files → LFS storage      │
│    • LFS pointers in repo           │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│  Render Clone:                      │
│    • git lfs pull                   │
│    • Downloads actual files         │
│    • Models available for Python    │
└─────────────────────────────────────┘
```

---

## Network Communication

```
Internet
    ↓
HTTPS (443)
    ↓
Render Load Balancer
    ↓
    ├─→ Frontend Service (Static CDN)
    │   • Serves HTML/CSS/JS
    │   • No backend logic
    │
    └─→ Backend Service (Node.js)
        • Handles API requests
        • CORS enabled
        • JSON responses
        
Frontend ↔ Backend:
    • Cross-origin requests (CORS)
    • Content-Type: application/json
    • Methods: GET, POST
```

---

## Performance Considerations

### Free Tier Behavior

```
Request → Backend (sleeping)
    ↓
Wake up (~30 seconds)
    ↓
Load Node.js
    ↓
Import modules
    ↓
Handle request
    ↓
(Stays awake for 15 minutes)
    ↓
No requests → Sleep
```

### Starter Tier Behavior

```
Request → Backend (always awake)
    ↓
Immediate response (~100ms)
    ↓
Process continuously
    ↓
No sleep
```

---

## Scaling Options

### Current Setup (Single Instance)
```
1 Frontend Service (Static)
    +
1 Backend Service (Node + Python)
    =
Simple, cost-effective
```

### Future Scaling
```
1. Horizontal Scaling:
   • Multiple backend instances
   • Load balancer distributes requests

2. Microservices:
   • Separate ML service
   • API gateway
   • Database for results caching

3. Optimization:
   • Model caching in memory
   • Result caching (Redis)
   • CDN for frontend assets
```

---

## Security Flow

```
User Request
    ↓
HTTPS (TLS 1.3)
    ↓
Render Infrastructure
    ↓
CORS Check
    ↓
API Authentication (optional)
    ↓
Input Validation
    ↓
Process Request
    ↓
Response
```

---

## Monitoring Points

```
1. Frontend Metrics:
   • Page load time
   • Bundle size
   • API call success rate

2. Backend Metrics:
   • Response time
   • Error rate
   • Memory usage
   • Python process spawns

3. Model Metrics:
   • Prediction latency
   • Model load time
   • Accuracy tracking
```

---

## Backup & Recovery

```
Code:
    GitHub Repository
    ↓
    Version controlled
    ↓
    Can rollback anytime

Models:
    Git LFS (GitHub)
    ↓
    Version tracked
    ↓
    Alternative: Cloud storage backup

Configuration:
    render.yaml in repo
    ↓
    Infrastructure as Code
    ↓
    Reproducible deployment
```

---

This architecture provides a solid foundation for your FIFA prediction app with room for future enhancements! 🚀

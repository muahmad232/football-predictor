# ⚽ Football Player AI Predictor

<div align="center">
  
![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933.svg?logo=node.js)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB.svg?logo=python)
![XGBoost](https://img.shields.io/badge/ML-XGBoost-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**AI-Powered Football Player Prediction & Scouting Platform**

[🚀 Live Demo](#-live-demo) • [✨ Features](#-key-features) • [🛠️ Tech Stack](#%EF%B8%8F-technology-stack) • [📁 Project Structure](#-project-structure) • [🚀 Installation](#-installation--local-development) • [🔌 API](#-api-endpoints) • [📊 ML Models](#-ml-model-summary)

</div>

---

## 🔗 Live Demo

🚀 **Try the app live here:**  
👉 **https://football-player-creator.vercel.app/**

> Frontend hosted on **Vercel**  
> Backend + ML inference hosted on **Render**

---

## 📖 Overview

**Football Player AI Predictor** is a full-stack, machine-learning–powered web application that predicts football player **overall ratings**, **ideal positions**, **league tiers**, and **similar players** based on statistical attributes.

Designed as a **scouting & analytics tool**, the app supports both **Outfield Players** and **Goalkeepers**, using separate prediction pipelines for each.

---

## ✨ Key Features

### 🧠 AI & ML Features

- **[Overall Rating Prediction](#-ml-model-summary)**
  - XGBoost regression model
  - Predicts FIFA-style OVR (1–99)
  - Trained on 10,000+ real player profiles

- **[Position Mapping](#-ml-model-summary)**
  - Determines best tactical role automatically
  - Different logic for:
    - Strikers
    - Wingers
    - Midfielders
    - Defenders
    - Goalkeepers

- **[League Tier Classification](#-ml-model-summary)**
  - Top Tier / Mid Tier / Lower Tier
  - Hybrid ML + rule-based logic

- **[Player Similarity Engine](#-ml-model-summary)**
  - Finds top 5 similar players
  - Euclidean distance in 35D feature space
  - Includes real player names & ratings

- **[Dual ML Pipelines](#%EF%B8%8F-technology-stack)**
  - Separate models for:
    - Outfield players
    - Goalkeepers

---

### 🎨 UI & UX

- Modern **React-based UI**
- Fully **responsive** (mobile + desktop)
- Interactive sliders with color-coded feedback
- Clean dashboard-style results view

---

## 🛠️ Technology Stack

### Frontend
- **React.js (18+)**
- JavaScript (ES6+)
- CSS3
- Deployed on **[Vercel](https://vercel.com)**

### Backend
- **Node.js**
- **Express.js**
- REST API
- Python execution via child processes
- Deployed on **[Render](https://render.com)**

### Machine Learning
- **Python 3.9+**
- **scikit-learn**
- **XGBoost**
- NumPy, Pandas
- Joblib for model serialization

---

## 📁 Project Structure

```
football-ai-predictor/
│
├── backend/
│   ├── controllers/        # API logic
│   ├── routes/             # Express routes
│   ├── scripts/            # Python ML inference
│   ├── models/             # Trained ML models
│   ├── server.js           # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # App pages
│   │   ├── styles/         # CSS styling
│   │   └── App.jsx
│   └── package.json
│
├── requirements.txt        # Python dependencies
└── render.yaml             # Render deployment config
```

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js 18+**
- **Python 3.9+**
- npm or yarn
- Git

---

### 🔧 Clone & Install

```bash
git clone https://github.com/muahmad232/football-ai-predictor.git
cd football-ai-predictor
```

#### Install all dependencies (monorepo):

```bash
npm run install-all
```

---

### 🌱 Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

---

### 🧠 Python ML Environment

```bash
pip install -r requirements.txt
```

---

### ▶️ Run Locally

```bash
npm run dev
```

- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5001`

---

## ☁️ Deployment Notes

### Git LFS (Recommended)

ML models are large, so Git LFS is used:

```bash
git lfs install
git add .
git commit -m "feat: add ML models with LFS"
git push origin main
```

---

## 🔌 API Endpoints

### Outfield Player Prediction

```http
POST /api/predict/outfield
```

**Request Body:**
```json
{
  "pace": 85,
  "shooting": 78,
  "passing": 82,
  "dribbling": 88,
  "defending": 45,
  "physical": 72
  // ... additional attributes
}
```

---

### Goalkeeper Prediction

```http
POST /api/predict/goalkeeper
```

**Request Body:**
```json
{
  "diving": 85,
  "handling": 82,
  "kicking": 75,
  "reflexes": 88,
  "speed": 65,
  "positioning": 84
  // ... additional attributes
}
```

---

## 📊 ML Model Summary

| Task                    | Model              | Metric         |
| ----------------------- | ------------------ | -------------- |
| OVR Prediction          | XGBoost Regressor  | R² > 0.95      |
| Position Classification | XGBoost Classifier | Accuracy > 90% |
| League Tier             | Hybrid ML + Rules  | Stable         |
| Similarity              | Euclidean Distance | Top-5 Nearest  |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Muhammad Ahmad**

- 📧 Email: [ahmadnaul.495@gmail.com](mailto:ahmadnaul.495@gmail.com)
- 🐙 GitHub: [@muahmad232](https://github.com/muahmad232)
- 🔗 LinkedIn: [Muhammad Ahmad](https://www.linkedin.com/in/muhammad-ahmad-517324372)

---

## ⭐ Support

If you found this project useful, consider giving it a **star ⭐** on GitHub!  
It helps a lot and motivates further development.

---

## 🙏 Acknowledgments

- Football player data sourced from publicly available datasets
- Inspired by modern football analytics platforms
- Built with passion for football and AI

---

<div align="center">

**Made with ❤️ and ⚽ using AI & Machine Learning**

[⬆ Back to Top](#-football-player-ai-predictor)

</div>

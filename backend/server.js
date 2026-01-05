const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const predictRoutes = require('./routes/predictRoutes');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow Vercel frontend and localhost
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://fifa-prediction.vercel.app',
    /\.vercel\.app$/ // Allow all Vercel preview deployments
  ],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON request bodies

// --- API Routes ---
// Mount the prediction routes
app.use('/api/predict', predictRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'FIFA Player Prediction API',
    version: '1.0.0',
    endpoints: {
      outfield: '/api/predict/outfield',
      goalkeeper: '/api/predict/goalkeeper'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
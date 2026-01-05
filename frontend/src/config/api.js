// API configuration based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  OUTFIELD: `${API_BASE_URL}/api/predict/outfield`,
  GOALKEEPER: `${API_BASE_URL}/api/predict/goalkeeper`,
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL;

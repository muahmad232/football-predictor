const express = require('express');
const router = express.Router();
const { getPrediction } = require('../controllers/predictController');

/**
 * @route   POST /api/predict/outfield
 * @desc    Get outfield player predictions
 * @access  Public
 */
router.post('/outfield', getPrediction);

/**
 * @route   POST /api/predict/goalkeeper
 * @desc    Get goalkeeper predictions
 * @access  Public
 */
router.post('/goalkeeper', getPrediction);

module.exports = router;
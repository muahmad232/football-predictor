const express = require('express');
const router = express.Router();
const { getPrediction } = require('../controllers/predictController');

/**
 * @route   POST /api/predict
 * @desc    Get all player predictions (OVR, Position, League, Similar)
 * @access  Public
 */
router.post('/', getPrediction);

module.exports = router;
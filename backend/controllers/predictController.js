const { spawn } = require('child_process');
const path = require('path');

// Main controller to handle prediction
const getPrediction = (req, res) => {
  const { playerType, ...attributes } = req.body;

  console.log('Prediction request received:', { playerType, attributeCount: Object.keys(attributes).length });

  let scriptPath = '';
  if (playerType === 'Outfield') {
    scriptPath = path.join(__dirname, '../scripts/predict_outfield.py');
  } else if (playerType === 'GK') {
    scriptPath = path.join(__dirname, '../scripts/predict_gk.py');
  } else {
    return res.status(400).json({ error: 'Invalid playerType provided.' });
  }

  console.log('Script path:', scriptPath);

  // Use 'python3' for Linux (Render) or 'python' for Windows
  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
  console.log('Python command:', pythonCommand);
  
  const pythonProcess = spawn(pythonCommand, [scriptPath]);

  let resultData = '';
  let errorData = '';

  // Write the player attributes to the Python script's standard input
  pythonProcess.stdin.write(JSON.stringify(attributes));
  pythonProcess.stdin.end();

  // Listen for data from the Python script's standard output
  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  // Listen for errors
  pythonProcess.stderr.on('data', (data) => {
    // --- FIX: Store stderr data, but don't treat it as a fatal error yet ---
    errorData += data.toString();
    console.error('Python stderr:', data.toString());
  });

  // Handle the script exit
  pythonProcess.on('close', (code) => {
    console.log('Python process exited with code:', code);
    console.log('Result data length:', resultData.length);
    console.log('Error data:', errorData);
    
    // --- FIX: Check the exit code. 0 means success. ---
    // Only treat it as an error if the exit code is NOT 0.
    if (code !== 0) {
      // The script failed
      return res.status(500).json({
        error: 'Failed to get prediction from model.',
        details: errorData || 'Python script exited with an error.',
      });
    }

    // --- SUCCESS ---
    // The script succeeded (code === 0), even if it printed warnings to stderr.
    // Try to parse the resultData.
    try {
      const prediction = JSON.parse(resultData);
      res.json(prediction);
    } catch (e) {
      console.error('JSON parse error:', e);
      // The script exited successfully but didn't return valid JSON.
      res.status(500).json({
        error: 'Failed to parse prediction result from model.',
        details: resultData,
        stderr_warnings: errorData, // Include warnings for debugging
      });
    }
  });

  pythonProcess.on('error', (error) => {
    console.error('Failed to start Python process:', error);
    res.status(500).json({
      error: 'Failed to start Python process',
      details: error.message
    });
  });
};

module.exports = { getPrediction };
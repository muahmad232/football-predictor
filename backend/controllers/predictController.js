import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main controller to handle prediction
export const getPrediction = (req, res) => {
  const { playerType, ...attributes } = req.body;

  let scriptPath = '';
  if (playerType === 'Outfield') {
    scriptPath = path.join(__dirname, '../scripts/predict_outfield.py');
  } else if (playerType === 'GK') {
    scriptPath = path.join(__dirname, '../scripts/predict_gk.py');
  } else {
    return res.status(400).json({ error: 'Invalid playerType provided.' });
  }

  // Use 'python' for Windows compatibility
  const pythonProcess = spawn('python', [scriptPath]);

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
  });

  // Handle the script exit
  pythonProcess.on('close', (code) => {
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
      // The script exited successfully but didn't return valid JSON.
      res.status(500).json({
        error: 'Failed to parse prediction result from model.',
        details: resultData,
        stderr_warnings: errorData, // Include warnings for debugging
      });
    }
  });
};
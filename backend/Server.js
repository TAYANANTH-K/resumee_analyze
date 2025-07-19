
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = 4000;

// Enable CORS
app.use(cors());

// Configure Multer to save uploaded PDF
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, 'resume.pdf'); // Always overwrite for simplicity
  }
});
const upload = multer({ storage });

// Route: POST /analyze
app.post('/analyze', upload.single('resume'), (req, res) => {
  const jobDescription = req.body.jobDescription;

  const python = spawn('python', ['analyze.py', 'uploads/resume.pdf', jobDescription]);

  let result = '';
  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error('Python Error:', data.toString());
  });

  python.on('close', (code) => {
    try {
      const json = JSON.parse(result);
      res.json(json);
    } catch (err) {
      console.error('Failed to parse Python output');
      res.status(500).send('Error processing resume');
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});



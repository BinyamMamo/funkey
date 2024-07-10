const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 5000;
app.use(express.static(__dirname));

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (request, file, callback) {
    callback(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Multer upload
const upload = multer({ storage: storage });

// Middleware to track upload progress
app.use((req, res, next) => {
  let uploadedBytes = 0;
  req.on('data', (chunk) => {
    uploadedBytes += chunk.length;
    const progress = (uploadedBytes / req.headers['content-length']) * 100;
    // console.log(`Upload progress: ${progress.toFixed(2)}%`);
  });
  next();
});

app.get('/upload', async (request, response) => {
  response.sendFile(__dirname + '/upload.html');
  // response.sendFile(__dirname + '/upload.html');
});

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    // Validate file type (ensure it's an image, video, or lyrics)
    const allowedMimeTypes = {
			image: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
			video: ['video/mp4', 'video/webm', 'video/ogg'],
			lyrics: ['text/plain', 'text/lrc', 'text/srt'],
		};		

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (!allowedMimeTypes[req.body.type].includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type.' });
    }

    // Respond with success message
    res.status(200).json(req.file);
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

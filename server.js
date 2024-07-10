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
    console.log(`Upload progress: ${progress.toFixed(2)}%`);
  });
  next();
});

app.get('/upload', async (request, response) => {
  response.sendFile(__dirname + '/upload.html');
  // response.sendFile(__dirname + '/upload.html');
});

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    // Validate file type (ensure it's an image)
    // if (!req.file) {
    //   return res.status(400).json({ error: 'No file uploaded.' });
    // }

    // // Check if the file is an image (you can use more robust checks here)
    // const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    // if (!allowedMimeTypes.includes(req.file.mimetype)) {
    //   return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
    // }

    // Process the file (e.g., save it to disk or perform further actions)
    // ...

    // Respond with success message
    // res.status(200).json({ filename: req.file.filename });
		console.log('req.file:', req.file);
    res
      .status(200)
      .json(req.file);
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

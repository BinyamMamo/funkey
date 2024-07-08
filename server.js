const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;
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

app.get('/upload', async (request, response) => {
  response.sendFile(__dirname + '/upload.html');
});

app.post('/upload', upload.single('file'), (request, response) => {
  response.json({ filename: request.file.filename });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

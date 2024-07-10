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

app.get('/upload', (req, res) => {
    res.sendFile(__dirname + '/lab.html');
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ filename: req.file.filename });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

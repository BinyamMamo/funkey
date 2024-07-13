const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { urlFor } = require('../utils/helpers');

const renderUpload = async (req, res) => {
  res.sendFile(urlFor('upload.html'));
};

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Multer upload
const upload = multer({ storage: storage });

// Middleware to track upload progress
// app.use((req, res, next) => {
//   let uploadedBytes = 0;
//   req.on('data', (chunk) => {
//     uploadedBytes += chunk.length;
//     const progress = (uploadedBytes / req.headers['content-length']) * 100;
//     // console.log(`Upload progress: ${progress.toFixed(2)}%`);
//   });
//   next();
// });

const postupload = async (req, res) => {
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

    res.status(200).json({...req.file, message: 'uploaded succesfully!'});
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteUpload = async (req, res) => {
	try {
		let filePath = req.body.filePath || null;

		if (!filePath) {
			res.status(400).json({message: 'Deletion not successful!'})
			throw new Error('Deletion not successful!');
		}

		fs.unlinkSync(filePath);
		res.status(200).json({message: 'Succesfully deleted!'});
	} catch(err) {
		console.error(err);
	}
}

module.exports = {
  renderUpload,
	deleteUpload,
	postupload,
	upload,
};

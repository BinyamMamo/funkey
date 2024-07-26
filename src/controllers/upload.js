const fs = require('fs');
const path = require('path');
const { urlFor } = require('../utils/helpers');
const Roles = require('../utils/roles');
const multer = require('multer');
const { cloudStorage, localStorage } = require('../config/cloudinary-config');

const uploadLocal = multer({ storage: localStorage });
const uploadCloud = multer({ storage: cloudStorage });

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

    res.status(200).json({ ...req.file, message: 'uploaded succesfully!' });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteUpload = async (req, res) => {
  try {
    let filePath = req.body.filePath || null;

    if (!filePath) {
      res.status(400).json({ message: 'File not found!' });
      console.error({ error: 'File not found!' });
    }

    if (filePath.startsWith('/')) filePath = filePath.substring(1);

    let music = await Music.find({
      $or: [{ video: `/${filePath}` }, { lyrics: `/${filePath}` }],
    });

    if (music && req.user.role != Roles.ADMIN) {
      res.status(400).json({ message: 'Deletion not allowed!' });
      console.error({ error: 'Deletion not allowed!' });
    }

    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'Succesfully deleted!' });
  } catch (err) {
    res.sendStatus(400);
    console.error(err);
  }
};

module.exports = {
  deleteUpload,
  postupload,
  uploadLocal,
  uploadCloud,
};

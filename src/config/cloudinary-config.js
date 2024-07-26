const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const subdirectory = req.body.folderName || 'others';
    const format = file.mimetype.split('/')[1]; // Extract the file format from the MIME type

    return {
      folder: `uploads/${subdirectory}`,
      format: format, // Use the extracted file format
      public_id: file.originalname.split('.')[0],
    };
  },
});

const localStorage = multer.diskStorage({
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

module.exports = {cloudStorage, localStorage};

require('dotenv').config();
const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const cloudStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     const fileType = file.mimetype.split('/')[0] || 'other';
//     const format = file.mimetype.split('/')[1]; // Extract the file format from the MIME type

//     return {
//       folder: `uploads/${fileType}s`,
//       format: format, // Use the extracted file format
//       public_id: file.originalname.split('.')[0],
//     };
//   },
// });
// const upload = multer({ storage: cloudStorage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'file.html'));
});

// app.post('/upload', upload.single('file'), (req, res) => {
//   try {

//     if (!req.file) {
// 			console.error({ error: 'No file uploaded.' });
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     res.status(200).json({ ...req.file, message: 'uploaded succesfully!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });

app.get('/signed-upload', (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp: timestamp,
      folder: req.query.folder || 'default-folder',
    };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature: signature,
      timestamp: timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
  } catch (err) {
    console.log(err);
  }
});

const port = 7500;
app.listen(port, () => {
  console.clear();
  console.log(`server started on http://localhost:${port}`);
});

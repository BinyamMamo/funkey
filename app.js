const path = require('path');
const express = require('express');
const app = express();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Hey, there');
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json(req.file);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port} => localhost:${port}/`);
});

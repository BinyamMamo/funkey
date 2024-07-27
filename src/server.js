require('dotenv').config();
const path = require('path');
const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const session = require('express-session');
require('./config/passport-config');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = require('./config/db');
const routes = require('./routes/routes');
const errorHandler = require('./middleware/error_handler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();
// Connect to MongoDB
connectDB();

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
  }),
	cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Set up flash
app.use(flash());

// Middleware to set flash messages and user to locals for access in views
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set the directory for your views
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));


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

app.use(routes);

// Example route that throws an error
app.get('/error', (req, res) => {
  throw new Error('This is a test error');
});

// Add the not found handler middleware after all routes
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.clear();
  console.log('\x1Bc'); // Clears the console (Linux only)
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

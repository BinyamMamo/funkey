const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const dashboardController = require('../controllers/dashboard');
const User = require('../models/User');
const Music = require('../models/Music');
const musicRoutes = require('./music.routes');
const userRoutes = require('./user.routes');
const fakeRoute = require('./faker.routes');

// router.get('/', async (req, res) => {
// 	let musics = await Music.find();
//   res.render('home', { musics, avatar: null });
//   // res.render('home', { musics, avatar: null });
// });

router.get('/practice', async (req, res) => {
  // res.render('practice/practice');
  res.render('practice/practice');
});

router.get('/piano', async (req, res) => {
	res.render('piano/piano');
});

router.get('/', async (req, res) => {
	let musics = await Music.find();
  let avatar = null;
  if (req.session.userId) {
		avatar = req.session.avatar;
    console.log('not logged in');
  } else console.log('we are logged in');
	res.render('home', { musics, avatar });
});

router.get('/browse', async (req, res) => {
	let musics = await Music.find();
  res.render('browse', { musics, avatar: null });
  // res.render('home', { musics, avatar: null });
});

router.get('/dashboard', dashboardController.renderDashboard);
router.get('/upload', uploadController.renderUpload);
router.post(
  '/upload',
  uploadController.upload.single('file'),
  uploadController.postupload
);

router.use(musicRoutes);
router.use(userRoutes);
router.use(fakeRoute);
module.exports = router;

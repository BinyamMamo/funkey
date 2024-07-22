const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const dashboardController = require('../controllers/dashboard');
const practiceController = require('../controllers/practice')
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

router.post('/practice', practiceController.practice);

router.get('/practice', async (req, res) => {
  // res.render('practice/practice');
  res.render('practice/practice');
});

router.get('/practice/partials/:partialName', (req, res) => {
  const partialName = req.params.partialName;
  res.render(`practice/partials/${partialName}`);
});

router.get('/piano', async (req, res) => {
	res.render('piano/piano');
});

router.get('/tos', async (req, res) => {
	res.render('tos');
});

router.get('/', async (req, res) => {
	let musics = await Music.find();
  let avatar = null;
	if (req.user)
		avatar = req.user.avatar;
	res.render('home', { musics, avatar });
});

router.get('/browse', async (req, res) => {
	let musics = await Music.find();
	let avatar = null;
	if (req.user)
		avatar = req.user.avatar;
  res.render('browse', { musics, avatar });
  // res.render('home', { musics, avatar: null });
});

router.get('/dashboard', dashboardController.renderDashboard);
router.get('/upload', uploadController.renderUpload);
router.post(
  '/upload',
  uploadController.upload.single('file'),
  uploadController.postupload
);

router.get('/profile', async (req, res) => {
	let musics = await Music.find().limit(4);
  if (!req.isAuthenticated())
    return res.redirect('/login');

  let user = req.user;
	res.render('profile', { user, musics });
});

router.use(musicRoutes);
router.use(userRoutes);
router.use(fakeRoute);
module.exports = router;

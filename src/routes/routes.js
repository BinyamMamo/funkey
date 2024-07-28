const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const musicController = require('../controllers/music');
const dashboardController = require('../controllers/dashboard');
const practiceController = require('../controllers/practice')
const User = require('../models/User');
const Music = require('../models/Music');

// const apiRoutes = require('./api.routes');
const userRoutes = require('./user.routes');
const fakeRoute = require('./faker.routes');
const musicRoutes = require('./music.routes');

const { authUser, authRole } = require('../middleware/auth');
const { scopeMusics, canAccess } = require('../middleware/permissions');
const Roles = require('../utils/roles');
const userController = require('../controllers/users');

router.put('/profile/edit', authUser, uploadController.uploadCloud.single('file'), userController.editProfile);

router.get('/', async (req, res) => {
	let musics = await Music.find();
  let avatar = req.user && req.user.avatar;
	res.render('home', { musics: scopeMusics(req, musics), avatar });
	// res.render('home', { musics, avatar });
});

router.get('/browse', async (req, res) => {
	let musics = await Music.find();
	let avatar = req.user && req.user.avatar;
  res.render('browse', { musics: scopeMusics(req, musics), avatar });
});

router.post(
	'/upload',
  uploadController.uploadLocal.single('file'),
  uploadController.postupload
);

// router.post('/uploadMusic', authUser, uploadController.uploadLocal.array('files'),	musicController.uploadMusic);
router.post('/music/upload', authUser, musicController.uploadMusic);
router.get('/dashboard', dashboardController.renderDashboard);

router.get('/profile', authUser, async (req, res) => {
	let musics = await Music.find().limit(4);
  if (!req.isAuthenticated())
    return res.redirect('/login');

	res.render('profile', { user: req.user, musics: scopeMusics(req, musics) });
});


router.post('/practice', practiceController.practice);
router.get('/practice', async (req, res) => {
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


router.use(fakeRoute);
router.use(userRoutes);
router.use(musicRoutes);
// router.use('/api', apiRoutes);	
module.exports = router;

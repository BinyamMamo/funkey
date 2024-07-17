const express = require('express');
const signupController = require('../controllers/users');
const uploadController = require('../controllers/upload');
const musicController = require('../controllers/music');
const dashboardController = require('../controllers/dashboard');
const router = express.Router();
const User = require('../models/User');
const Music = require('../models/Music');

router.get('/signup', signupController.renderSignup);
router.post('/signup', signupController.handleSignup);
router.get('/login', signupController.renderLogin);
router.get('/logout', signupController.handleLogout);
router.post('/login', signupController.handleLogin);
router.get('/upload', uploadController.renderUpload);
router.post(
  '/upload',
  uploadController.upload.single('file'),
  uploadController.postupload
);

router.delete('/delete', signupController.deleteUser);
router.get('/users', signupController.getUsers);
router.get('/dashboard', dashboardController.renderDashboard);
router.get('/dashboard/users', dashboardController.renderUsers);
router.get('/dashboard/musics', dashboardController.renderMusics);

router.get('/', async (req, res) => {
	let musics = await Music.find();
	console.log(musics);
  res.render('home', { musics, avatar: null });
  // res.render('home', { musics, avatar: null });
});

router.get('/browse', async (req, res) => {
	let musics = await Music.find();
	console.log(musics);
  res.render('browse', { musics, avatar: null });
  // res.render('home', { musics, avatar: null });
});

// router.get('/', async (req, res) => {
//   let avatar = null;
//   if (req.session.userId) {
//     avatar = req.session.avatar;
//     console.log('not logged in');
//   } else console.log('we are logged in');
//   res.render('home', { avatar });
// });

router.get('/profile', async (req, res) => {
  let avatar = null;
  let user = null;
  if (req.session.userId) {
    let id = req.session.userId;
    user = await User.findById(id);
    console.log('not logged in');
  } else console.log('we are logged in');
  res.render('profile', { user });
});

router.get('/music/:musicId', async (req, res) => {
	let musicId = req.params.musicId;

	let music = await Music.findById(musicId);

	res.render('lyrics/lyrics', { music });
})
router.get('/test/lyrics', async (req, res) => {
  res.render('lyrics/lyrics', {
    music: { video: '/uploads/file-1720884141677.mp4', lyrics: '/uploads/file-1720884116391.txt' },
  });
});

router.post('/uploadMusic', musicController.uploadMusic);
router.delete('/deleteMusic', musicController.deleteMusic);
router.delete('/deleteUpload', uploadController.deleteUpload);
router.put('/update/views/:musicId', musicController.updateViews);
router.put('/update/rating', musicController.updateRating);

module.exports = router;

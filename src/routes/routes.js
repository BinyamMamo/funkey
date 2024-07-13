const express = require('express');
const signupController = require('../controllers/users');
const uploadController = require('../controllers/upload');
const musicController = require('../controllers/music');
const dashboardController = require('../controllers/dashboard');
const router = express.Router();
const User = require('../models/User');

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
	let avatar = null;
  if (req.session.userId) {
		avatar = req.session.avatar;
    console.log('not logged in');
  } else console.log('we are logged in');
  res.render('home', { avatar });
});

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

router.post('/uploadMusic', musicController.uploadMusic);
router.delete('/deleteMusic', musicController.deleteMusic);

module.exports = router;

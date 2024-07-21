const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const dashboardController = require('../controllers/dashboard');
const User = require('../models/User');
const passport = require('passport');

router.get('/dashboard/users', dashboardController.renderUsers);
router.get('/signup', userController.renderSignup);
router.post('/signup', userController.handleSignup);
router.get('/login', userController.renderLogin);
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// router.get('/logout', userController.handleLogout);
router.post('/login', userController.handleLogin);

router.delete('/delete', userController.deleteUser);
router.get('/users', userController.getUsers);

router.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  let user = req.user;
	res.render('profile', { user });


  // let avatar = null;
  // let user = null;
  // if (req.session.userId) {
  //   let id = req.session.userId;
  //   user = await User.findById(id);
  //   console.log('not logged in');
  // } else console.log('we are logged in');
});

module.exports = router;
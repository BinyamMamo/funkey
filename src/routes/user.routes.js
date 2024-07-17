const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const dashboardController = require('../controllers/dashboard');
const User = require('../models/User');

router.get('/dashboard/users', dashboardController.renderUsers);
router.get('/signup', userController.renderSignup);
router.post('/signup', userController.handleSignup);
router.get('/login', userController.renderLogin);
router.get('/logout', userController.handleLogout);
router.post('/login', userController.handleLogin);

router.delete('/delete', userController.deleteUser);
router.get('/users', userController.getUsers);

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

module.exports = router;
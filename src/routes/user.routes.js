const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/User');
const userController = require('../controllers/users');
const dashboardController = require('../controllers/dashboard');

router.get('/users', userController.getUsers);
router.get('/login', userController.renderLogin);
router.get('/signup', userController.renderSignup);
router.delete('/delete', userController.deleteUser);
router.get('/dashboard/users', dashboardController.renderUsers);


router.post('/signup', userController.handleSignup);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Login successful' });
    });
  })(req, res, next);
});

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return next(err);
      }
      res.clearCookie('connect.sid'); // Clear the cookie
      res.redirect('/');
    });
  });
});


module.exports = router;
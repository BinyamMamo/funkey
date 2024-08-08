const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/User');
const Roles = require('../utils/roles');
const userController = require('../controllers/users');
const { authUser, authRole } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard');

router.get('/login', userController.renderLogin);
router.get('/signup', userController.renderSignup);
router.delete('/delete', userController.deleteUser);
router.get('/dashboard/users', authUser, authRole(Roles.ADMIN), dashboardController.renderUsers);

router.post('/signup', userController.handleSignup);

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
    if (!user) {
			return res.status(401).json({ message: 'Invalid username or password' });
    }
    req.logIn(user, (err) => {
			let redirect_url = '/';
      if (err) return next(err);
			console.log('user:', user);
      if (user.role == 'ADMIN')
        redirect_url = '/dashboard';
			return res.status(200).json({ message: 'Login successful', redirect_url });
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

router.put('/update/score', authUser, userController.updateScore);
module.exports = router;

const express = require('express');
const signupController = require('../controllers/users');
const uploadController = require('../controllers/upload');
const router = express.Router();

router.get('/signup', signupController.renderSignup);
router.post('/signup', signupController.handleSignup);
router.get('/login', signupController.renderLogin);
router.post('/login', signupController.handleLogin);
router.get('/upload', uploadController.renderUpload);
router.post('/upload', uploadController.upload.single('file'),  uploadController.postupload);
router.delete('/delete', signupController.deleteUser);
router.get('/users', signupController.getUsers);
router.get('/dashboard', signupController.renderDashboard);

module.exports = router;

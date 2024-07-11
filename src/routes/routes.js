const express = require('express');
const signupController = require('../controllers/users');
const uploadController = require('../controllers/upload');
const router = express.Router();

router.get('/signup', signupController.renderSignup);
router.post('/signup', signupController.handleSignup);
router.get('/upload', uploadController.renderUpload);
router.post('/upload', uploadController.upload.single('file'),  uploadController.postupload);
router.delete('/delete', signupController.deleteUser);
router.get('/dashboard', signupController.getUsers);

module.exports = router;

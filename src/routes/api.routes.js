const express = require('express');
const router = express.Router();
const API_Controller = require('../controllers/api_controller');

router.get('/musics', API_Controller.getMusics);
router.get('/music/:id', API_Controller.getMusic);

module.exports = router;

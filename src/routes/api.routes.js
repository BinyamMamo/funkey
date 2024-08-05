const express = require('express');
const router = express.Router();
const API_Controller = require('../controllers/api_controller');

router.get('/musics', API_Controller.getMusics);
router.get('/music/:id', API_Controller.getMusic);

// youtube related endpoints
router.post('/yt/thumbnail', API_Controller.getThumbnail);
router.post('/yt/details', API_Controller.getDetails);
router.post('/yt/video', API_Controller.getVideo);
router.post('/yt/lyrics', API_Controller.getLyrics);
module.exports = router;

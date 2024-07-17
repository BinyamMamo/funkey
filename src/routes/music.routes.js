const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music');
const dashboardController = require('../controllers/dashboard');
const uploadController = require('../controllers/upload');
const Music = require('../models/Music');

router.get('/dashboard/musics', dashboardController.renderMusics);

router.get('/music/:musicId', async (req, res) => {
	let musicId = req.params.musicId;

	let music = await Music.findById(musicId);

	res.render('lyrics/lyrics', { music });
});

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

router.post('/music/favorite', musicController.toggleFavorite);
router.get('/favorites', musicController.getFavorites);
router.get('/library', musicController.getFavorites);
router.post('/music', musicController.getMusic);
module.exports = router;

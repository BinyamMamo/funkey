const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music');
const dashboardController = require('../controllers/dashboard');
const uploadController = require('../controllers/upload');
const Music = require('../models/Music');
const { authUser, authRole } = require('../middleware/auth');
const Roles = require('../utils/roles');

router.get(
  '/dashboard/musics',
  authUser,
  authRole(Roles.ADMIN),
  dashboardController.renderMusics
);

router.get('/music/:musicId', async (req, res) => {
  let musicId = req.params.musicId;

  let music = await Music.findById(musicId);

  res.render('lyrics/lyrics', { music });
});

router.get('/test/lyrics', authUser, authRole(Roles.ADMIN), async (req, res) => {
  res.render('lyrics/lyrics', {
    music: {
      video: '/uploads/test.mp4',
      lyrics: '/uploads/test.txt',
    },
  });
});

router.delete('/deleteMusic', authUser, musicController.deleteMusic);
router.delete('/deleteUpload', authUser, uploadController.deleteUpload);
router.put('/update/views/:id', musicController.updateViews);
router.put('/update/rating', musicController.updateRating);

router.post('/music/favorite', authUser, musicController.toggleFavorite);
router.get('/favorites', musicController.getFavorites);
router.get('/library', musicController.getFavorites);
router.post('/music', musicController.getMusic);

router.get('/search', musicController.search);

module.exports = router;

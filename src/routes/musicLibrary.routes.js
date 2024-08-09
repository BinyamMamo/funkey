const router = require('express').Router();
const musicLibraryController = require('../controllers/musicLibrary');
const { authUser } = require('../middleware/auth');

// getters
router.get('/library', musicLibraryController.getLibrary);
router.get('/uploads', musicLibraryController.getUploads);
router.get('/favorites', musicLibraryController.getFavorites);

router.get('/library/favorite/:id', musicLibraryController.getFavorite);
router.get('/library/favorite/toggle/:id', authUser, musicLibraryController.toggleFavorite);

// updaters
router.put('/update/rating', authUser, musicLibraryController.updateRating);
router.put('/update/views/:id', authUser, musicLibraryController.updateViews);
router.post('/update/watchHour', authUser, musicLibraryController.updateHour);

module.exports = router;

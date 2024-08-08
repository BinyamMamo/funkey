const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const musicController = require('../controllers/music');
const dashboardController = require('../controllers/dashboard');
const practiceController = require('../controllers/practice');
const User = require('../models/User');
const Music = require('../models/Music');

// const apiRoutes = require('./api.routes');
const userRoutes = require('./user.routes');
const fakeRoute = require('./faker.routes');
const musicRoutes = require('./music.routes');
const musicLibraryRoutes = require('./musicLibrary.routes');

const { authUser, authRole } = require('../middleware/auth');
const { scopeMusics, canAccess } = require('../middleware/permissions');
const Roles = require('../utils/roles');
const userController = require('../controllers/users');
const MusicLibrary = require('../models/MusicLibrary');

router.put(
  '/profile/edit',
  authUser,
  uploadController.uploadCloud.single('file'),
  userController.editProfile
);

router.get('/', async (req, res) => {
  let musics = await Music.aggregate([
		{
			$addFields: {
				averageScore: { $avg: ['$rating', '$views'] },
			},
		},
		{
			$sort: { averageScore: -1 },
		},
		{
			$limit: 8,
		},
	]);

  let avatar = req.user && req.user.avatar;
  res.render('home', { musics: scopeMusics(req, musics), avatar });
});

router.get('/browse', async (req, res) => {
  const LIMIT = 7;
  let page = req.query.page || '1';
  let sort = req.query.sort || 'alpha';
  let order = req.query.order || '1';

	order = isNaN(parseInt(order)) ? 1 : parseInt(order);
	page = isNaN(parseInt(page)) ? 1 : parseInt(page);

  const OFFSET = (page - 1) * LIMIT;
  let musics = [];

  if (sort == 'alpha')
    musics = await Music.find()
      .sort({ artist: order, title: order })
      .skip(OFFSET)
      .limit(LIMIT);
  else if (sort == 'popularity')
    musics = await Music.aggregate([
      {
        $addFields: {
          averageScore: { $avg: ['$rating', '$views'] },
        },
      },
      {
        $sort: { averageScore: order },
      },
      {
        $limit: LIMIT,
      },
    ])
      .skip(OFFSET)
      .limit(LIMIT);
  else musics = await Music.find().skip(OFFSET).limit(LIMIT);

  if (sort == 'random') musics = shuffleArray(musics);

  let uploadsCount = 0;
  if (req.user)
    uploadsCount = await MusicLibrary.countDocuments({
      userId: req.user._id,
    });

  let avatar = req.user && req.user.avatar;
  let musicsCount = await Music.countDocuments();
  res.render('browse', {
    musics: scopeMusics(req, musics),
    avatar,
    musicsCount,
    page,
    LIMIT,
		uploadsCount
  });
});

// Fisher-Yates (Knuth) shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

router.post(
  '/upload',
  uploadController.uploadLocal.single('file'),
  uploadController.postupload
);

// router.post('/uploadMusic', authUser, uploadController.uploadLocal.array('files'),	musicController.uploadMusic);
router.post('/music/upload', authUser, musicController.uploadMusic);
router.get('/dashboard', dashboardController.renderDashboard);

router.get('/profile', authUser, async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');

  let musics = await MusicLibrary.aggregate([
    {
      $match: { userId: req.user._id },
    },
    {
      $lookup: {
        from: 'musics',
        localField: 'musicId',
        foreignField: '_id',
        as: 'music',
      },
    },
    {
      $addFields: {
        'music.averageScore': { $avg: ['$rating', '$views', '$watchHour'] },
        'music.favorite': '$favorite',
      },
    },
    {
      $unwind: '$music',
    },
    {
      $replaceRoot: { newRoot: '$music' },
    },
    {
      $sort: {
        'music.avergeScore': -1,
        'music.favorite': 1,
      },
    },
    {
      $limit: 4,
    },
  ]);
  // let musics = await Music.find().limit(4);
  res.render('profile', { user: req.user, musics });
  // res.render('profile', { user: req.user, musics: scopeMusics(req, musics) });
});

router.post('/practice', practiceController.practice);
router.get('/practice', async (req, res) => {
  res.render('practice/practice');
});
router.get('/practice/partials/:partialName', (req, res) => {
  const partialName = req.params.partialName;
  res.render(`practice/partials/${partialName}`);
});
router.get('/piano', async (req, res) => {
  res.render('piano/piano');
});

router.get('/tos', async (req, res) => {
  res.render('tos');
});

router.use(fakeRoute);
router.use(userRoutes);
router.use(musicRoutes);
router.use(musicLibraryRoutes);
// router.use('/api', apiRoutes);
module.exports = router;

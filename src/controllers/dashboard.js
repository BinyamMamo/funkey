// Dashboard controller

let User = require('../models/User');
let Music = require('../models/Music');

const renderDashboard = async (req, res) => {
  try {
		console.log('req.user:', req.user);
		console.log(!req.user || req.user.role != 'ADMIN');
		if (!req.user || req.user.role != 'ADMIN') return res.redirect('/login');
    const musics = await Music.find();
    const userCount = await User.countDocuments();
    const musicCount = await Music.countDocuments();
    const uploadCount = await User.countDocuments({ public: false });

    const topUsers = await User.find().sort({ score: -1, watchHour: -1 }).limit(5);
    // const popularMusics = await Music.find().sort({ rating: -1, views: -1 }).limit(5);
    const popularMusics = await Music.aggregate([
      {
        $addFields: {
          averageScore: { $avg: ['$rating', '$views'] },
        },
      },
      {
        $sort: { averageScore: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.render('dashboard', {
      numUsers: userCount,
      numMusics: musicCount,
      numUploads: uploadCount,
      topUsers,
      popularMusics,
			musics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

const renderUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('dashboard/users', { users });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

const renderMusics = async (req, res) => {
  try {
    const musics = await Music.find();
    res.render('dashboard/musics', { musics });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

module.exports = {
  renderDashboard,
  renderUsers,
  renderMusics,
};

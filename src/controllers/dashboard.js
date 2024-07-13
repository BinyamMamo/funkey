// Dashboard controller

let User = require('../models/User');
let Music = require('../models/Music');

const renderDashboard = async (req, res) => {
  try {
    const users = await User.find();
    res.render('dashboard/');
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
}
const path = require('path');
const { urlFor, hash, validEmail } = require('../utils/helpers');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const renderSignup = async (req, res) => {
  res.render('signup');
};

const renderLogin = async (req, res) => {
  res.render('login');
};

const handleSignup = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!validEmail(email)) {
      res.status(400).json({ error: 'Invalid Email' });
      throw new Error('Invalid email');
    }

    if (name.length < 3) {
      res.status(400).json({ error: 'Name should be >3 characters' });
      throw new Error('Name should be >3 characters');
    }

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'User already exists' });
      throw new Error('User already exists');
    }

    user = new User({
      name,
      email,
      password: await hash(password),
      avatar: `/${avatar}`,
    });

    await user.save();
    res.status(200).json({ msg: 'User registered successfully!', user });
  } catch (err) {
    console.error(err);
  }
};

const handleLogout = async (req, res) => {
	try {
		if (!req.session || !req.session.userId) {
			res.status(400).json({error: 'No session found!'});
			throw new Error('No session found!');
		}
		req.session.destroy();
		res.json({msg: 'Logged out succesfully!'});
		res.redirect('/');
	} catch (err) { console.error(err); }
}

const deleteUser = async (req, res) => {
  try {
    const id = req.body.id || null;
    if (!id) {
      res.status(400).json({ error: 'Id Not Found!' });
      throw new Error('Id Not Found!');
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(400).json({ error: 'User Not Found!' });
      throw new Error('User Not Found!');
    }

    res.status(200).json({ msg: `${user.name} was deleted succesfully!` });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  renderSignup,
  handleSignup,
  handleLogout,
  renderLogin,
  deleteUser,
};

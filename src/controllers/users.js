const path = require('path');
const { urlFor, hash, validEmail } = require('../utils/helpers');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const renderSignup = async (req, res) => {
  res.sendFile(urlFor('signup.html'));
};

const renderLogin = async (req, res) => {
  res.sendFile(urlFor('login.html'));
};

const handleSignup = async (req, res) => {
  try {
    let formData = req.body;
    const { name, email, password, avatar } = formData;

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
      avatar,
    });

    await user.save();
    res.status(200).json({ msg: 'User registered successfully!', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    let formData = req.body;
    const { email, password } = formData;

    if (!validEmail(email)) {
      res.status(400).json({ error: 'Invalid Email' });
      throw new Error('Invalid email');
    }

    let user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'User not found!' });
      throw new Error('User not found!');
    }

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      res.status(400).json({ error: 'Incorrect password!' });
      throw new Error('Incorrect password!');
    }

    res.status(200).json({ msg: 'signed in successfully!', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const renderDashboard = async (req, res) => {
  try {
    const users = await User.find();
    res.render('dashboard', { users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.body.id || null;
    console.log('req.body:', req.body);
    console.log('id:', id);
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
  renderDashboard,
  renderSignup,
  handleSignup,
  renderLogin,
  handleLogin,
  deleteUser,
  getUsers,
};

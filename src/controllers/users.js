const path = require('path');
const { urlFor, hash } = require('../utils/helpers');
const User = require('../models/User');

const renderSignup = async (req, res) => {
  res.sendFile(urlFor('signup.html'));
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
    res.status(200).send('User registered');
    // res.json('signed up successfully!');
    // res.json('signed in successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

function validEmail(email) {
  // Regular expression for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
		res.render('dashboard', { users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async(req, res) => {
	try {
		const id = req.body.id || null;
		console.log('req.body:', req.body);
		console.log('id:', id);
		if (!id) {
			res.status(400).json({error: 'Id Not Found!'});
			throw new Error('Id Not Found!');
		}
		
		const user = await User.findByIdAndDelete(id);
		
		if (!user) {
			res.status(400).json({error: 'User Not Found!'});
			throw new Error('User Not Found!');
		}

		res.status(200).json({msg: `${user.name} was deleted succesfully!`});
	} catch (err) {
		console.error(err);
	}
};

module.exports = {
  renderSignup,
  handleSignup,
	deleteUser,
  getUsers,
};

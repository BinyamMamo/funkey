const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
		type: String,
		enum: ['BASIC', 'ADMIN'],
		default: 'BASIC'
	},
	name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

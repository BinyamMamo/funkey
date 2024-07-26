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
	watchHour: {
		type: Number,
		min: 0,
		default: 0
	},
	score: {
		type: Number,
		min: 0,
		default: 0
	},
	stars: {
		type: Number,
		min: 0,
		default: 0
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;

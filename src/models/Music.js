const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  lyrics: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
	views: {
		type: Number,
		min: 0,
		default: 0,
	},
	public: {
		type: Boolean,
		default: true
	},
	userId: {
		type: String,
		required: false
	},
	thumbnail: {
		type: String,
		default: 'assets/images/default_thumbnail.jpg'
	}
});

// default: 'https://tse2.mm.bing.net/th?id=OIG2.5dM5XXn27bsOWSTcjIWe&pid=ImgGn'

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;

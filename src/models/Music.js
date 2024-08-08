const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema(
  {
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
      default: true,
    },
    userId: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      default: '/assets/images/default_thumbnail.jpg',
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    favoritedAt: {
      type: String,
      default: 'unknown',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);
const Music = mongoose.model('Music', musicSchema);

module.exports = Music;

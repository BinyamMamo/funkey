const mongoose = require('mongoose');

const musicLibrarySchema = new mongoose.Schema(
  {
    musicId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      min: 0,
      default: 0,
    },
    watchHour: {
      type: Number,
      default: 0,
    },
    uploaded: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Adding indexes
musicLibrarySchema.index({ musicId: 1 });
musicLibrarySchema.index({ userId: 1 });

// Creating the model
const MusicLibrary = mongoose.model('MusicLibrary', musicLibrarySchema);

module.exports = MusicLibrary;

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    gpxData: {
      type: String, // Stringified GeoJSON or GPX XML
      default: ''
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['EASY', 'MODERATE', 'HARD', 'EXTREME'],
      default: 'MODERATE',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        name: { type: String, required: true },
        comment: { type: String, required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
        date: { type: Date, default: Date.now },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);

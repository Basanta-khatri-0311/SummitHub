const mongoose = require('mongoose');

const partnerRequestSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
      default: 'INTERMEDIATE',
    },
    partnersNeeded: {
      type: Number,
      default: 1,
    },
    joinedPartners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED', 'COMPLETED'],
      default: 'OPEN',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PartnerRequest', partnerRequestSchema);

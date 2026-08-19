const mongoose = require('mongoose');

const mentorshipProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    role: {
      type: String,
      enum: ['mentor', 'mentee', 'both'],
      required: true,
    },
    headline: { type: String, required: true, trim: true, maxlength: 120 },
    about: { type: String, required: true, maxlength: 800 },
    topics: [
      {
        type: String,
        enum: ['education', 'health', 'career', 'leadership', 'community', 'entrepreneurship'],
      },
    ],
    availability: {
      type: String,
      enum: ['open', 'limited', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

const mentorshipRequestSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

mentorshipRequestSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = {
  MentorshipProfile: mongoose.model('MentorshipProfile', mentorshipProfileSchema),
  MentorshipRequest: mongoose.model('MentorshipRequest', mentorshipRequestSchema),
};

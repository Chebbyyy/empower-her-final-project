const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['workshop', 'webinar', 'meetup', 'panel'],
      default: 'workshop',
    },
    category: {
      type: String,
      enum: ['leadership', 'education', 'health', 'career', 'community'],
      default: 'community',
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    location: { type: String, default: 'Online' },
    isOnline: { type: Boolean, default: true },
    meetingLink: { type: String, default: '' },
    capacity: { type: Number, default: 50 },
    image: { type: String, default: '' },
    hostName: { type: String, default: 'EmpowerHer' },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);

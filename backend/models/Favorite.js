const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: {
      type: String,
      enum: ['book', 'resource', 'event'],
      required: true,
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, default: '' },
    meta: { type: String, default: '' },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    type: { type: String, enum: ['book', 'journal'], required: true },
    summary: { type: String, required: true },
    excerpt: { type: String, default: '' },
    year: { type: Number },
    category: {
      type: String,
      enum: ['memoir', 'leadership', 'education', 'activism', 'health', 'business', 'history'],
      default: 'memoir',
    },
    coverAccent: { type: String, default: '#1b3a2f' },
    coverImage: { type: String, default: '' },
    link: { type: String, default: '' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);

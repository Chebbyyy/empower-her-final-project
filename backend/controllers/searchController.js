const Book = require('../models/Book');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const Post = require('../models/Post');

exports.searchAll = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json({ books: [], resources: [], events: [], posts: [] });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const [books, resources, events, posts] = await Promise.all([
      Book.find({
        $or: [{ title: regex }, { author: regex }, { summary: regex }, { category: regex }],
      })
        .limit(8)
        .select('title author category type'),
      Resource.find({ $or: [{ title: regex }, { link: regex }] })
        .limit(8)
        .select('title link'),
      Event.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }, { type: regex }],
      })
        .limit(8)
        .select('title type category startAt location'),
      Post.find({ $or: [{ title: regex }, { body: regex }, { topic: regex }] })
        .limit(8)
        .select('title topic createdAt')
        .populate('author', 'name'),
    ]);

    res.json({ books, resources, events, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

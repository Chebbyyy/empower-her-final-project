const Favorite = require('../models/Favorite');
const Book = require('../models/Book');
const Resource = require('../models/Resource');
const Event = require('../models/Event');

async function resolveItem(itemType, itemId) {
  if (itemType === 'book') {
    const book = await Book.findById(itemId);
    if (!book) return null;
    return { title: book.title, meta: book.author };
  }
  if (itemType === 'resource') {
    const resource = await Resource.findById(itemId);
    if (!resource) return null;
    return { title: resource.title, meta: resource.link };
  }
  if (itemType === 'event') {
    const event = await Event.findById(itemId);
    if (!event) return null;
    return { title: event.title, meta: event.type };
  }
  return null;
}

exports.getFavorites = async (req, res) => {
  try {
    const { itemType } = req.query;
    const filter = { user: req.user._id };
    if (itemType && itemType !== 'all') filter.itemType = itemType;

    const favorites = await Favorite.find(filter).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) {
      return res.status(400).json({ message: 'itemType and itemId are required' });
    }

    const resolved = await resolveItem(itemType, itemId);
    if (!resolved) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user._id, itemType, itemId },
      {
        user: req.user._id,
        itemType,
        itemId,
        title: resolved.title,
        meta: resolved.meta,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already saved' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const deleted = await Favorite.findOneAndDelete({
      user: req.user._id,
      itemType,
      itemId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const favorite = await Favorite.findOne({
      user: req.user._id,
      itemType,
      itemId,
    });
    res.json({ saved: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

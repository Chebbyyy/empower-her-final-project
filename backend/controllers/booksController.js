const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;

    const books = await Book.find(filter).sort({ year: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, author, type, summary, excerpt, year, category, coverAccent, coverImage, link } =
      req.body;

    if (!title || !author || !type || !summary) {
      return res.status(400).json({
        message: 'Title, author, type, and summary are required',
      });
    }

    const book = new Book({
      title,
      author,
      type,
      summary,
      excerpt: excerpt || '',
      year: year || undefined,
      category: category || 'memoir',
      coverAccent: coverAccent || '#1b3a2f',
      coverImage: coverImage || '',
      link: link || '',
      addedBy: req.user._id || req.user.id,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

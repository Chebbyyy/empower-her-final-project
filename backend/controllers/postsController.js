const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = {};
    if (topic && topic !== 'all') filter.topic = topic;

    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('comments.author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, body, topic } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const post = await Post.create({
      author: req.user._id,
      title,
      body,
      topic: topic || 'general',
    });

    const populated = await Post.findById(post._id)
      .populate('author', 'name')
      .populate('comments.author', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ message: 'Comment body is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ author: req.user._id, body });
    await post.save();

    const populated = await Post.findById(post._id)
      .populate('author', 'name')
      .populate('comments.author', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const User = require('../models/User');
const Book = require('../models/Book');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const Photo = require('../models/Photo');
const Post = require('../models/Post');
const ContactMessage = require('../models/ContactMessage');
const { MentorshipProfile } = require('../models/Mentorship');

exports.getStats = async (req, res) => {
  try {
    const [
      users,
      books,
      resources,
      events,
      photos,
      posts,
      messages,
      mentorshipProfiles,
      unreadMessages,
    ] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Resource.countDocuments(),
      Event.countDocuments(),
      Photo.countDocuments(),
      Post.countDocuments(),
      ContactMessage.countDocuments(),
      MentorshipProfile.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
    ]);

    res.json({
      users,
      books,
      resources,
      events,
      photos,
      posts,
      messages,
      mentorshipProfiles,
      unreadMessages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(100);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markMessageRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find()
      .select('-path')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setPhotoApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { isApproved: !!isApproved },
      { new: true }
    ).populate('uploadedBy', 'name email');
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
      '-password'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

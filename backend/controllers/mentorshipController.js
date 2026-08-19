const { MentorshipProfile, MentorshipRequest } = require('../models/Mentorship');
const { createNotification } = require('./notificationsController');

exports.getProfiles = async (req, res) => {
  try {
    const { role, topic } = req.query;
    const filter = { availability: { $ne: 'closed' } };

    if (role === 'mentor') filter.role = { $in: ['mentor', 'both'] };
    if (role === 'mentee') filter.role = { $in: ['mentee', 'both'] };
    if (topic && topic !== 'all') filter.topics = topic;

    const profiles = await MentorshipProfile.find(filter)
      .populate('user', 'name bio interests')
      .sort({ updatedAt: -1 });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await MentorshipProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email bio interests'
    );
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.upsertProfile = async (req, res) => {
  try {
    const { role, headline, about, topics, availability } = req.body;

    if (!role || !headline || !about) {
      return res.status(400).json({ message: 'Role, headline, and about are required' });
    }

    const profile = await MentorshipProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        role,
        headline,
        about,
        topics: Array.isArray(topics) ? topics : [],
        availability: availability || 'open',
      },
      { upsert: true, new: true, runValidators: true }
    ).populate('user', 'name email bio interests');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ message: 'Recipient and message are required' });
    }

    if (to === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a request to yourself' });
    }

    const existing = await MentorshipRequest.findOne({ from: req.user._id, to });
    if (existing) {
      if (existing.status === 'declined') {
        existing.status = 'pending';
        existing.message = message;
        await existing.save();
        const populated = await MentorshipRequest.findById(existing._id)
          .populate('from', 'name email')
          .populate('to', 'name email');

        await createNotification({
          user: to,
          type: 'mentorship',
          title: 'New mentorship request',
          body: `${req.user.name} sent you a mentorship request.`,
          link: '/mentorship',
        });

        return res.status(201).json(populated);
      }
      return res.status(400).json({ message: 'You already sent a request to this person' });
    }

    const request = await MentorshipRequest.create({
      from: req.user._id,
      to,
      message,
    });

    const populated = await MentorshipRequest.findById(request._id)
      .populate('from', 'name email')
      .populate('to', 'name email');

    await createNotification({
      user: to,
      type: 'mentorship',
      title: 'New mentorship request',
      body: `${req.user.name} sent you a mentorship request.`,
      link: '/mentorship',
    });

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already sent a request to this person' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const incoming = await MentorshipRequest.find({ to: req.user._id })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ createdAt: -1 });

    const outgoing = await MentorshipRequest.find({ from: req.user._id })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ createdAt: -1 });

    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or declined' });
    }

    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    request.status = status;
    await request.save();

    const populated = await MentorshipRequest.findById(request._id)
      .populate('from', 'name email')
      .populate('to', 'name email');

    await createNotification({
      user: request.from,
      type: 'mentorship',
      title: status === 'accepted' ? 'Mentorship request accepted' : 'Mentorship request declined',
      body: `${req.user.name} ${status} your mentorship request.`,
      link: '/mentorship',
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

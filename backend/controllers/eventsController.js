const Event = require('../models/Event');
const { createNotification } = require('./notificationsController');

exports.getEvents = async (req, res) => {
  try {
    const { type, category, upcoming } = req.query;
    const filter = {};

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;
    if (upcoming === 'true') filter.startAt = { $gte: new Date() };

    const events = await Event.find(filter)
      .populate('attendees', 'name')
      .sort({ startAt: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      startAt,
      endAt,
      location,
      isOnline,
      meetingLink,
      capacity,
      image,
      hostName,
    } = req.body;

    if (!title || !description || !startAt) {
      return res.status(400).json({ message: 'Title, description, and start date are required' });
    }

    const event = await Event.create({
      title,
      description,
      type,
      category,
      startAt,
      endAt,
      location,
      isOnline,
      meetingLink,
      capacity,
      image,
      hostName,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id.toString();
    const already = event.attendees.some((id) => id.toString() === userId);

    if (already) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'This event is full' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    const populated = await Event.findById(event._id).populate('attendees', 'name');

    await createNotification({
      user: req.user._id,
      type: 'event',
      title: 'RSVP confirmed',
      body: `You're registered for “${event.title}”.`,
      link: '/events',
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRsvp = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id.toString();
    event.attendees = event.attendees.filter((id) => id.toString() !== userId);
    await event.save();

    const populated = await Event.findById(event._id).populate('attendees', 'name');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

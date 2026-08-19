const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Name, email, and message are required',
      });
    }

    await ContactMessage.create({
      name,
      email,
      subject: subject || '',
      message,
    });

    console.log('[contact]', { name, email, subject: subject || '(none)', at: new Date().toISOString() });

    res.status(201).json({
      message: 'Message received. Thank you for writing in.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

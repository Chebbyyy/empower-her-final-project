const mongoose = require('mongoose');
const { seedBooksIfEmpty, syncBookCovers } = require('../seed/booksSeed');
const { seedEventsIfEmpty } = require('../seed/eventsSeed');
const { seedMentorshipIfEmpty } = require('../seed/mentorshipSeed');
const { seedResourcesIfEmpty } = require('../seed/resourcesSeed');
const { seedPostsIfEmpty } = require('../seed/postsSeed');

const runSeed = async (label, fn) => {
  try {
    await fn();
  } catch (error) {
    console.error(`${label} failed:`, error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/empowerHer');
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Continuing without database connection...');
    return;
  }

  await runSeed('Books seed', seedBooksIfEmpty);
  await runSeed('Book cover sync', syncBookCovers);
  await runSeed('Events seed', seedEventsIfEmpty);
  await runSeed('Mentorship seed', seedMentorshipIfEmpty);
  await runSeed('Resources seed', seedResourcesIfEmpty);
  await runSeed('Posts seed', seedPostsIfEmpty);
};

module.exports = connectDB;

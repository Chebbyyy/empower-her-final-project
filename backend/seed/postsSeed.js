const Post = require('../models/Post');
const User = require('../models/User');

const seedBodies = [
  {
    title: 'What helped you start a career shift?',
    body: 'I’m exploring a move into leadership and would love practical tips — books, courses, or habits that actually helped you.',
    topic: 'career',
  },
  {
    title: 'Finding time for wellness while studying',
    body: 'Between classes and work, health often slips. What small routines keep you grounded?',
    topic: 'health',
  },
  {
    title: 'Mentorship that actually worked',
    body: 'Share a mentorship experience that made a difference — what made the relationship useful?',
    topic: 'leadership',
  },
];

async function seedPostsIfEmpty() {
  const count = await Post.countDocuments();
  if (count > 0) {
    console.log(`Community posts already seeded (${count}).`);
    return;
  }

  const users = await User.find().limit(3);
  if (users.length === 0) {
    console.log('Skipping posts seed — no users yet. Register, then restart the server.');
    return;
  }

  const docs = seedBodies.map((post, i) => ({
    ...post,
    author: users[i % users.length]._id,
  }));

  await Post.insertMany(docs);
  console.log(`Seeded ${docs.length} community posts.`);
}

module.exports = { seedPostsIfEmpty };

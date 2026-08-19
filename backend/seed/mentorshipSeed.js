const { MentorshipProfile } = require('../models/Mentorship');
const User = require('../models/User');

const seedProfiles = [
  {
    emailHint: null,
    role: 'mentor',
    headline: 'Career coach for early-career women in tech',
    about:
      'I help women navigate first jobs, promotions, and confidence at work. Happy to mentor on interviews, LinkedIn, and workplace advocacy.',
    topics: ['career', 'leadership'],
    availability: 'open',
  },
  {
    emailHint: null,
    role: 'mentor',
    headline: 'Education advocate & community organizer',
    about:
      'Focused on girls’ education access and local organizing. Open to mentees building community programs or scholarship initiatives.',
    topics: ['education', 'community'],
    availability: 'limited',
  },
  {
    emailHint: null,
    role: 'mentee',
    headline: 'Looking for guidance on entrepreneurship',
    about:
      'Starting a small wellness brand and would love advice on funding, marketing, and balancing growth with wellbeing.',
    topics: ['entrepreneurship', 'health'],
    availability: 'open',
  },
];

async function seedMentorshipIfEmpty() {
  const count = await MentorshipProfile.countDocuments();
  if (count > 0) return;

  const users = await User.find().limit(3);
  if (users.length === 0) {
    console.log('No users to seed mentorship profiles — skip.');
    return;
  }

  const docs = users.map((user, i) => ({
    user: user._id,
    ...seedProfiles[i % seedProfiles.length],
  }));

  await MentorshipProfile.insertMany(docs);
  console.log(`Seeded ${docs.length} mentorship profiles.`);
}

module.exports = { seedMentorshipIfEmpty };

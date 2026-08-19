const Event = require('../models/Event');

const daysFromNow = (days, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const seedEvents = [
  {
    title: 'Leading with Clarity',
    description:
      'A practical workshop on communication, decision-making, and leading teams with confidence. Includes small-group exercises and a Q&A.',
    type: 'workshop',
    category: 'leadership',
    startAt: daysFromNow(7, 10),
    endAt: daysFromNow(7, 12),
    location: 'Online via Zoom',
    isOnline: true,
    meetingLink: 'https://zoom.us/',
    capacity: 40,
    hostName: 'EmpowerHer Mentors',
    image: '/images/breaking barrier.jpg',
  },
  {
    title: 'Career Confidence Circles',
    description:
      'Peer-led meetup for women navigating career transitions. Share wins, challenges, and strategies in a supportive space.',
    type: 'meetup',
    category: 'career',
    startAt: daysFromNow(12, 18),
    endAt: daysFromNow(12, 19),
    location: 'Community Hub, Nairobi',
    isOnline: false,
    capacity: 25,
    hostName: 'Purity Kagwiria',
    image: '/images/inspiring.jpg',
  },
  {
    title: 'Women’s Health 101 Webinar',
    description:
      'An accessible webinar covering wellness basics, mental health check-ins, and how to find trusted health resources.',
    type: 'webinar',
    category: 'health',
    startAt: daysFromNow(18, 15),
    endAt: daysFromNow(18, 16),
    location: 'Online',
    isOnline: true,
    meetingLink: 'https://meet.google.com/',
    capacity: 100,
    hostName: 'EmpowerHer Health Collective',
    image: '/images/strength.jpg',
  },
  {
    title: 'Education Access Panel',
    description:
      'Panelists discuss barriers to girls’ education and what communities can do — from scholarships to advocacy.',
    type: 'panel',
    category: 'education',
    startAt: daysFromNow(25, 14),
    endAt: daysFromNow(25, 16),
    location: 'Online',
    isOnline: true,
    meetingLink: 'https://zoom.us/',
    capacity: 80,
    hostName: 'EmpowerHer Education Team',
    image: '/images/building.jpg',
  },
  {
    title: 'Community Storytelling Night',
    description:
      'Open mic and guided storytelling for women who want to share experiences of growth, leadership, and solidarity.',
    type: 'meetup',
    category: 'community',
    startAt: daysFromNow(30, 19),
    endAt: daysFromNow(30, 21),
    location: 'EmpowerHer Gallery Space',
    isOnline: false,
    capacity: 35,
    hostName: 'EmpowerHer Community',
    image: '/images/Women supporting other women.jpg',
  },
];

async function seedEventsIfEmpty() {
  const count = await Event.countDocuments();
  if (count > 0) return;
  await Event.insertMany(seedEvents);
  console.log(`Seeded ${seedEvents.length} events.`);
}

module.exports = { seedEventsIfEmpty, seedEvents };

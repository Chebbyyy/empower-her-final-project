const Resource = require('../models/Resource');

const seedResources = [
  {
    title: 'UN Women — Gender equality resources',
    link: 'https://www.unwomen.org/en',
  },
  {
    title: 'WHO — Women’s health overview',
    link: 'https://www.who.int/health-topics/women-s-health',
  },
  {
    title: 'Lean In — Career & leadership tools',
    link: 'https://leanin.org/',
  },
  {
    title: 'Girls Who Code — Learn to code',
    link: 'https://girlswhocode.com/',
  },
  {
    title: 'Malala Fund — Education advocacy',
    link: 'https://malala.org/',
  },
  {
    title: 'SheWorks! — Skills and opportunity',
    link: 'https://sheworksglobal.org/',
  },
];

async function seedResourcesIfEmpty() {
  const count = await Resource.countDocuments();
  if (count > 0) {
    console.log(`Resources already seeded (${count}).`);
    return;
  }
  await Resource.insertMany(seedResources);
  console.log(`Seeded ${seedResources.length} resources.`);
}

module.exports = { seedResourcesIfEmpty };

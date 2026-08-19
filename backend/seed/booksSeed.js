const Book = require('../models/Book');

const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

const seedBooks = [
  {
    title: 'Becoming',
    author: 'Michelle Obama',
    type: 'book',
    year: 2018,
    category: 'memoir',
    coverAccent: '#2d4a6f',
    coverImage: cover('9781524763138'),
    excerpt:
      'For me, becoming isn’t about arriving somewhere or achieving a certain aim. I see it instead as forward motion, a means of evolving.',
    summary:
      'Michelle Obama’s memoir traces her journey from Chicago’s South Side to the White House. She writes honestly about identity, motherhood, public scrutiny, and finding her voice. The book is both personal and political — a reflection on what it means to grow, adapt, and lead while staying rooted in your values.',
    link: 'https://www.penguinrandomhouse.com/books/563895/becoming-by-michelle-obama/',
  },
  {
    title: 'I Am Malala',
    author: 'Malala Yousafzai',
    type: 'book',
    year: 2013,
    category: 'education',
    coverAccent: '#6b3a2f',
    coverImage: cover('9780316322409'),
    excerpt:
      'One child, one teacher, one book, one pen can change the world.',
    summary:
      'Malala Yousafzai tells the story of her fight for girls’ education in Pakistan’s Swat Valley, the attack that nearly took her life, and her recovery on a global stage. It is a testament to courage, family, and the belief that education is a fundamental right — not a privilege.',
    link: 'https://www.malala.org/books',
  },
  {
    title: 'We Should All Be Feminists',
    author: 'Chimamanda Ngozi Adichie',
    type: 'book',
    year: 2014,
    category: 'activism',
    coverAccent: '#8b4545',
    coverImage: cover('9781101911761'),
    excerpt:
      'Culture does not make people. People make culture.',
    summary:
      'Adapted from her celebrated TED talk, Adichie offers a clear, accessible essay on what feminism means today. She draws on everyday experiences to show how gender expectations limit everyone — and why inclusion and awareness matter for building a fairer world.',
    link: 'https://www.chimamanda.com/',
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    type: 'journal',
    year: 1947,
    category: 'history',
    coverAccent: '#4a5568',
    coverImage: cover('9780553296983'),
    excerpt:
      'In spite of everything I still believe that people are really good at heart.',
    summary:
      'Anne Frank’s journal, written while hiding from Nazi persecution, captures the inner life of a teenage girl facing unimaginable fear with curiosity, humor, and hope. It remains one of the most powerful records of the Holocaust and a timeless voice on humanity.',
    link: 'https://www.annefrank.org/',
  },
  {
    title: 'My Life on the Road',
    author: 'Gloria Steinem',
    type: 'book',
    year: 2015,
    category: 'activism',
    coverAccent: '#3d5a45',
    coverImage: cover('9780812993547'),
    excerpt:
      'The road is made in the walking.',
    summary:
      'Feminist icon Gloria Steinem reflects on decades of organizing, listening, and movement-building across America. Part travel memoir, part manifesto, the book celebrates conversation, coalition, and the idea that change happens when people show up for one another.',
    link: 'https://www.penguinrandomhouse.com/books/317074/my-life-on-the-road-by-gloria-steinem/',
  },
  {
    title: 'Year of Yes',
    author: 'Shonda Rhimes',
    type: 'book',
    year: 2015,
    category: 'leadership',
    coverAccent: '#5c3d6b',
    coverImage: cover('9781476777122'),
    excerpt:
      'Say yes to everything that scares you.',
    summary:
      'Television powerhouse Shonda Rhimes chronicles a year of saying “yes” to opportunities she would normally avoid — speaking in public, appearing on camera, prioritizing herself. Warm, funny, and candid, it is a guide to stepping outside comfort zones and owning your power.',
    link: 'https://www.shondaland.com/',
  },
  {
    title: 'Untamed',
    author: 'Glennon Doyle',
    type: 'book',
    year: 2020,
    category: 'health',
    coverAccent: '#7a5234',
    coverImage: cover('9781984801258'),
    excerpt:
      'We can do hard things.',
    summary:
      'Glennon Doyle writes about unlearning the roles society assigns to women and reclaiming intuition, desire, and authenticity. Through personal stories, she invites readers to trust themselves, set boundaries, and live with more freedom and honesty.',
    link: 'https://momastery.com/',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    type: 'book',
    year: 2018,
    category: 'education',
    coverAccent: '#2f4858',
    coverImage: cover('9780399590504'),
    excerpt:
      'An education is not so much about making a living as making a person.',
    summary:
      'Tara Westover grew up in a survivalist family in rural Idaho without formal schooling. Her memoir follows her path to Cambridge and Harvard, exploring the cost and reward of leaving home, the power of learning, and the complexity of family loyalty.',
    link: 'https://www.penguinrandomhouse.com/books/551917/educated-by-tara-westover/',
  },
  {
    title: 'The Argonauts',
    author: 'Maggie Nelson',
    type: 'book',
    year: 2015,
    category: 'memoir',
    coverAccent: '#6b5344',
    coverImage: cover('9781555977530'),
    excerpt:
      'The story shifts depending on where you start telling it.',
    summary:
      'A genre-bending memoir about love, gender, identity, and family-making. Nelson blends personal narrative with theory and poetry to explore what it means to build a life and a family on your own terms — fluid, thoughtful, and deeply human.',
    link: 'https://www.graywolfpress.org/books/argonauts',
  },
  {
    title: 'The Diary of Frida Kahlo',
    author: 'Frida Kahlo',
    type: 'journal',
    year: 1995,
    category: 'history',
    coverAccent: '#8b2942',
    coverImage: cover('9780810958128'),
    excerpt:
      'I paint my own reality.',
    summary:
      'Published decades after her death, Frida Kahlo’s illustrated journal reveals her inner world — pain, passion, politics, and surreal imagination. Part diary, part artwork, it offers an intimate look at one of the most iconic artists of the 20th century.',
    link: 'https://www.fridakahlo.org/',
  },
];

async function seedBooksIfEmpty() {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany(seedBooks);
      console.log(`Seeded ${seedBooks.length} books and journals.`);
    }
  } catch (error) {
    console.error('Book seed error:', error.message);
  }
}

async function syncBookCovers() {
  try {
    for (const book of seedBooks) {
      await Book.updateOne(
        { title: book.title, author: book.author },
        {
          $set: {
            coverImage: book.coverImage,
            coverAccent: book.coverAccent,
          },
        }
      );
    }
    console.log('Book cover images synced.');
  } catch (error) {
    console.error('Book cover sync error:', error.message);
  }
}

module.exports = { seedBooksIfEmpty, syncBookCovers, seedBooks };

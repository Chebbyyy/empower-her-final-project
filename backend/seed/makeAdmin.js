/**
 * One-time helper: promote a user to admin by email.
 * Usage: node seed/makeAdmin.js you@example.com
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node seed/makeAdmin.js email@example.com');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/empowerHer');
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: 'admin' },
    { new: true }
  );

  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }

  console.log(`Promoted ${user.name} <${user.email}> to admin.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

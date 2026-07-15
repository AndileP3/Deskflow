// Run with: npm run seed
// Creates two demo accounts so the login screen has something to authenticate against.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Ticket = require('./models/Ticket');

const seed = async () => {
  await connectDB();

  console.log('[SEED] Clearing existing users and tickets...');
  await User.deleteMany({});
  await Ticket.deleteMany({});

  console.log('[SEED] Creating demo users...');
  const employee = await User.create({
    name: 'Erin Employee',
    email: 'employee@deskflow.com',
    password: 'password123',
    role: 'Employee'
  });

  const admin = await User.create({
    name: 'Alex Admin',
    email: 'admin@deskflow.com',
    password: 'password123',
    role: 'Admin'
  });

  console.log('[SEED] Creating sample tickets...');
  await Ticket.create([
    {
      title: "Monitor won't turn on",
      description: 'Tried a different outlet and cable, still no display.',
      priority: 'High',
      status: 'Open',
      createdBy: employee._id
    },
    {
      title: 'Need software license for design tool',
      description: 'Requesting an Adobe Creative Cloud license for the marketing team.',
      priority: 'Low',
      status: 'In Progress',
      createdBy: employee._id
    }
  ]);

  console.log('[SEED] Done!');
  console.log('----------------------------------------');
  console.log('Employee login -> employee@deskflow.com / password123');
  console.log('Admin login    -> admin@deskflow.com / password123');
  console.log('----------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('[SEED] Error seeding database:', err);
  process.exit(1);
});

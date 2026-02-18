/**
 * Database Seeding Script
 * * Clears existing users and populates the database with initial test accounts.
 * Utilizes the shared connection pool and Prisma driver adapter.
 * * @module prisma/seed
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/index.js';
import pool from '../src/db/pool.js'; // Importing your existing pool
import bcrypt from 'bcryptjs';

/**
 * Main seeding logic
 * * 1. Initializes Prisma with the shared pool adapter
 * 2. Deletes existing user records
 * 3. Creates seeded users with hashed passwords
 * * @async
 * @function main
 */
async function main() {
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Database Seeding Started ---');

  console.log('Step 1: Cleaning existing data...');
  await prisma.user.deleteMany({});

  console.log('Step 2: Hashing passwords...');
  const hashedPassword = await bcrypt.hash('testpass123', 10);

  console.log('Step 3: Inserting user records...');

  const seedUsers = [
    { username: 'Bryan', password: hashedPassword, admin: false },
    { username: 'Odin', password: hashedPassword, admin: true },
    { username: 'Damon', password: hashedPassword, admin: false },
  ];

  for (const user of seedUsers) {
    const createdUser = await prisma.user.create({ data: user });
    console.log(
      `+ Created ${user.admin ? 'Admin' : 'User'}: ${createdUser.username}`,
    );
  }

  console.log('--- Seed Completed Successfully! ---');

  // Explicitly disconnect Prisma for the seed process
  await prisma.$disconnect();
}

/**
 * Script execution and lifecycle management
 */
main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the shared pool connection to allow the process to exit
    await pool.end();
  });

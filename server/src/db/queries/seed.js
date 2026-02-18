/**
 * Prisma Seed Script
 * Replaces seed.sql and initDb.js
 */
import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  // This clears the users table
  await prisma.user.deleteMany({});

  console.log('Seeding data...');
  const hashedPassword = await bcrypt.hash('testpass123', 10);

  // Create Bryan (User)
  await prisma.user.create({
    data: {
      username: 'Bryan',
      password: hashedPassword,
      admin: false,
    },
  });

  // Create Odin (Admin)
  await prisma.user.create({
    data: {
      username: 'Odin',
      password: hashedPassword,
      admin: true,
    },
  });

  // Create Damon (User)
  await prisma.user.create({
    data: {
      username: 'Damon',
      password: hashedPassword,
      admin: false,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

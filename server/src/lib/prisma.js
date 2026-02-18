/**
 * Prisma Client Instance
 * * Configures the Prisma Client to use the shared PostgreSQL connection pool
 * via the Prisma driver adapter for node-postgres.
 * * @module lib/prisma
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/index.js';
import pool from '../db/pool.js';

/**
 * Prisma Adapter Configuration
 * Wraps the existing pg pool in the PrismaPg adapter
 */
const adapter = new PrismaPg(pool);

/**
 * Shared PrismaClient instance
 * Configured with the driver adapter to maintain connection efficiency
 */
const prisma = new PrismaClient({ adapter });

export { prisma };

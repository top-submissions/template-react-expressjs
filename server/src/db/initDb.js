#! /usr/bin/env node

/**
 * Database Initialization Script
 *
 * Executable script to build database schema and seed initial data.
 * Reads schema.sql and seed.sql files and executes them against the database.
 * Run with: npm run db:init
 *
 * @module db/initDb
 */

import pkg from 'pg';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main initialization function
 *
 * Connects to database, executes schema and seed SQL files in order.
 * Handles connection lifecycle and error logging.
 *
 * @async
 * @returns {Promise<void>}
 */
async function main() {
  console.log('Building schema and seeding database...');

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Read SQL files from disk
    const schemaSql = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8',
    );
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    await client.connect();

    // Execute schema creation (tables, indexes, etc.)
    console.log('Executing Schema...');
    await client.query(schemaSql);

    // Execute seed data (initial records, test data)
    console.log('Executing Seeds...');
    await client.query(seedSql);

    console.log('Database populated successfully.');
  } catch (err) {
    console.error('Error during database population:', err.stack);
  } finally {
    // Always close database connection
    await client.end();
  }
}

// Execute main function
main();

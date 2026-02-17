#! /usr/bin/env node

import pkg from 'pg';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const schemaSql = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8',
    );
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    await client.connect();

    console.log('Executing Schema...');
    await client.query(schemaSql);

    console.log('Executing Seeds...');
    await client.query(seedSql);

    console.log('Database populated successfully.');
  } catch (err) {
    console.error('Error during database population:', err.stack);
  } finally {
    await client.end();
  }
}

main();

#! /usr/bin/env node

import pkg from 'pg';
import 'dotenv/config';

const { Client } = pkg;

const schema = `
CREATE TABLE IF NOT EXISTS usernames (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 )
);

INSERT INTO usernames (username) 
VALUES
  ('Bryan'),
  ('Odin'),
  ('Damon');
`;

const seed = `
TRUNCATE TABLE IF EXISTS usernames RESTART IDENTITY;

INSERT INTO usernames (username) 
VALUES
  ('Bryan'),
  ('Odin'),
  ('Damon');
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });
  try {
    await client.connect();
    await client.query(schema);
    await client.query(seed);
    console.log('done');
  } catch (err) {
    console.error('Error during seeding: ', err.message);
  } finally {
    await client.end();
  }
}

main();

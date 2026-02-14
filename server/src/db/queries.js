import { MyPool } from './pool.js';

export async function getAllUsernames() {
  const { rows } = await MyPool.query('SELECT * FROM usernames');
  return rows;
}

export async function insertUsername(username) {
  await MyPool.query('INSERT INTO usernames (username) VALUES ($1)', [
    username,
  ]);
}

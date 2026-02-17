/**
 * PostgreSQL Connection Pool
 *
 * Creates and exports a connection pool for database operations.
 * Pools provide reusable connections, improving performance over creating new connections.
 *
 * @module db/pool
 */

import pkg from 'pg';
const { Pool } = pkg;

/**
 * Connection pool configuration
 * Uses environment variables with sensible defaults
 * Pool manages multiple connections automatically
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

export default pool;

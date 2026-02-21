import pkg from 'pg';
const { Pool } = pkg;

/**
 * PostgreSQL Connection Pool.
 * * Manages reusable database connections for performance.
 * * Uses environment variables for flexible configuration.
 * @type {Pool}
 */
const pool = new Pool({
  // Define connection parameters from environment
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

export default pool;

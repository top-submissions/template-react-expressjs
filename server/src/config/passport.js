/**
 * Passport Authentication Configuration
 *
 * Configures Passport.js with local strategy for username/password authentication.
 * Handles user verification, password comparison, and session serialization.
 *
 * @module config/passport
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';

/**
 * Local Strategy Configuration
 *
 * Verifies user credentials during login attempts.
 * Queries database for username, validates password using bcrypt.
 *
 * @param {string} username - Username from login form
 * @param {string} password - Password from login form
 * @param {Function} done - Passport callback to indicate authentication result
 * @returns {void}
 */
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Attempt to find user by username
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
      );
      const user = rows[0];

      // No user found with provided username
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      // Compare provided password with stored hash
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      // Authentication successful - return user object
      return done(null, user);
    } catch (err) {
      // Database or server error
      return done(err);
    }
  }),
);

/**
 * Serialize User
 *
 * Determines what user data should be stored in the session.
 * Only stores the user ID to minimize session size.
 *
 * @param {Object} user - Authenticated user object from database
 * @param {Function} done - Callback to complete serialization
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize User
 *
 * Retrieves full user object from database using ID stored in session.
 * Called on every request after login to populate req.user.
 *
 * @param {number} id - User ID stored in session
 * @param {Function} done - Callback with retrieved user object
 */
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

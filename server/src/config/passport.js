import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import * as userQueries from '../db/queries/userQueries.js';
import * as authQueries from '../db/queries/authQueries.js';

/**
 * Handles initial login by verifying username and password.
 * * Compares plain-text password with hashed database record.
 * * Returns user object on success or error message on failure.
 * @param {string} username
 * @param {string} password
 * @param {function} done
 * @returns {void}
 */
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find user in database
      const user = await userQueries.getUserByUsername(username);
      if (!user) return done(null, false, { message: 'Incorrect username' });

      // Check if password is valid
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

/**
 * Extracts JWT from either an HttpOnly cookie or the Authorization header.
 * * Prioritizes cookies for EJS/SSR support.
 * * Falls back to Bearer token for API support.
 * @param {Object} req
 * @returns {string|null}
 */
const cookieOrHeaderExtractor = (req) => {
  // Check cookie first
  if (req?.cookies?.token) return req.cookies.token;
  // Fallback to header
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

/**
 * Validates the JWT for protected routes and retrieves the current user.
 * * Decodes payload using secret key.
 * * Ensures user still exists in database.
 * @param {Object} payload - Decoded JWT data.
 * @param {function} done
 * @returns {void}
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieOrHeaderExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // Fetch user from DB using ID in token
        const user = await authQueries.getUserById(payload.id);
        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

/**
 * Passport Authentication Configuration
 * Sets up two strategies:
 * 1. LocalStrategy: Validates credentials (username/password) to issue a token.
 * 2. JwtStrategy: Validates the token on subsequent requests to authorize access.
 * @module config/passport
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import * as userQueries from '../db/queries/userQueries.js';
import * as authQueries from '../db/queries/authQueries.js';

/**
 * Local Strategy Configuration
 * Handles initial authentication. Finds the user by username and compares
 * the provided password with the hashed version in the database.
 */
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userQueries.getUserByUsername(username);
      if (!user) return done(null, false, { message: 'Incorrect username' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

/**
 * Custom JWT Extractor
 * Logic to retrieve the token from either:
 * 1. An 'HttpOnly' cookie (standard for SSR/EJS sites).
 * 2. An 'Authorization: Bearer' header (standard for SPA/Mobile apps).
 * @param {Object} req - The Express request object
 * @returns {string|null} The extracted JWT token
 */
const cookieOrHeaderExtractor = (req) => {
  // Try to get token from cookies first
  if (req?.cookies?.token) return req.cookies.token;
  // Fallback to standard Bearer header extraction
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

/**
 * JWT Strategy Configuration
 * Intercepts requests to protected routes. It decodes the payload,
 * verifies the signature using the JWT_SECRET, and ensures the user
 * identified in the payload still exists in the database.
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieOrHeaderExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // payload.id was injected during JWT signing in authController
        const user = await authQueries.getUserById(payload.id);
        if (!user) return done(null, false);

        // Passport attaches this user to req.user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

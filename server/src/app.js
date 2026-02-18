/**
 * Main Application Entry Point
 *
 * Configures and initializes the Express application with all necessary middleware,
 * session handling, Passport authentication, and route registration.
 *
 * @module app
 */

import 'dotenv/config';
import express from 'express';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import session from 'express-session';
import passport from 'passport';
import pgSession from 'connect-pg-simple';
import pool from './db/pool.js';
import './config/passport.js';
import indexRouter from './routes/indexRouter.js';

const app = express();
const PostgresStore = pgSession(session);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * View Engine Configuration
 * Sets up EJS as the template engine and defines views directory location
 */
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

/**
 * Static Assets Configuration
 * Serves public files (CSS, images, client-side JavaScript) from the public directory
 */
const assetsPath = path.join(__dirname, '..', 'public');
app.use(express.static(assetsPath));

/**
 * Request Body Parsing
 * Parses URL-encoded bodies (from HTML form submissions)
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Session Configuration
 * Stores session data in PostgreSQL using connect-pg-simple
 * Sessions persist across server restarts and scale horizontally
 */
app.use(
  session({
    store: new PostgresStore({
      pool: pool,
      tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
    },
  }),
);

/**
 * Passport Session Integration
 * Connects Passport authentication with session management
 * This enables persistent login sessions across requests
 */
app.use(passport.session());

/**
 * View Locals Middleware
 * Makes the current user available to all EJS templates as 'currentUser'
 * Allows conditional rendering based on authentication status
 */
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/**
 * Route Registration
 * Mounts all authentication-related routes under the root path
 */
app.use('/', indexRouter);

/**
 * Global Error Handler
 * Catches and processes any errors that occur during request handling
 * Sends appropriate error response with status code and message
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.SERVER_PORT || 3000;

/**
 * Server Initialization
 * Starts the Express server on the configured port
 * Logs server URL for easy access during development
 */
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(
    `Server started on port ${PORT}.\nView live in http://localhost:${PORT}/`,
  );
});

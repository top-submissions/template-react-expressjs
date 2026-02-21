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
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import './config/passport.js';
import indexRouter from './routes/indexRouter.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 * Enables the server to accept requests from different origins (e.g., a React frontend).
 * Placed at the top to handle pre-flight OPTIONS requests correctly.
 */
app.use(cors());

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
 * express.json() parses incoming JSON payloads (common for APIs).
 * express.urlencoded() parses bodies from HTML form submissions.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize());

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

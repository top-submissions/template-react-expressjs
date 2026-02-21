import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import corsOptions from '../config/corsOptions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configures global application middleware.
 * * Sets up security via CORS and request parsing.
 * * Initializes authentication and static asset serving.
 * @param {import('express').Express} app - The Express application instance.
 * @returns {void}
 */
export const configureMiddleware = (app) => {
  // Apply CORS
  app.use(cors(corsOptions));

  // Serve assets from public directory
  const assetsPath = path.join(__dirname, '..', '..', 'public');
  app.use(express.static(assetsPath));

  // Parse payloads and cookies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Set up passport identity tracking
  app.use(passport.initialize());

  // Inject identity into templates
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });
};

/**
 * Global error handling setup.
 * @param {import('express').Express} app - The Express application instance.
 */
export const configureErrorHandling = (app) => {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
  });
};

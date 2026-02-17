/**
 * Authentication Routes
 *
 * Defines all routes related to user authentication including login, signup,
 * logout, and protected dashboard access with appropriate middleware protection.
 *
 * @module routes/authRouter
 */

import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {
  isAuthenticated,
  isNotAuthenticated,
} from '../middleware/authMiddleware.js';

const authRouter = Router();

/**
 * Public Routes
 * Accessible to all users
 */

// Landing page - public
authRouter.get('/', authController.authLandingGet);

/**
 * Authentication Routes
 * Protected by isNotAuthenticated - only accessible to non-logged-in users
 */

// Sign-up routes
authRouter.get('/sign-up', isNotAuthenticated, authController.authSignupGet);
authRouter.post('/sign-up', authController.authSignupPost); // POST doesn't need middleware

// Login routes
authRouter.get('/log-in', isNotAuthenticated, authController.authLoginGet);
authRouter.post('/log-in', authController.authLoginPost); // POST doesn't need middleware

/**
 * Protected Routes
 * Require authentication - guarded by isAuthenticated middleware
 */

// Dashboard - only accessible to logged-in users
authRouter.get('/dashboard', isAuthenticated, authController.authDashboardGet);

/**
 * Logout Route
 * Accessible to all (but only useful for logged-in users)
 */
authRouter.get('/log-out', authController.authLogoutGet);

export default authRouter;

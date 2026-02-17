/**
 * Authentication Routes
 *
 * Defines all routes related to user authentication including login, signup,
 * logout, protected dashboard access, and admin-only routes.
 * Routes are protected by appropriate middleware based on access requirements.
 *
 * @module routes/authRouter
 */

import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isNotAdmin,
} from '../middleware/authMiddleware.js';

const authRouter = Router();

/**
 * Public Routes
 * Accessible to all users regardless of authentication status
 */

// Landing page - public access
authRouter.get('/', authController.authLandingGet);

/**
 * Authentication Routes
 * Protected by isNotAuthenticated - only accessible to non-logged-in users
 * Prevents authenticated users from accessing signup/login pages
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
 * Only accessible to logged-in users regardless of role
 */

// Dashboard - only accessible to logged-in users
authRouter.get('/dashboard', isAuthenticated, authController.authDashboardGet);

/**
 * Admin Routes
 * Require both authentication AND admin privileges
 * Guarded by isAdmin middleware - only administrators can access
 */

// Admin dashboard - only for administrators
authRouter.get(
  '/admin/dashboard',
  isAdmin,
  authController.authAdminDashboardGet,
);

// Admin user management - only for administrators
authRouter.get('/admin/users', isAdmin, authController.authAdminUsersGet);
authRouter.post(
  '/admin/users/:id/promote',
  isAdmin,
  authController.authAdminPromotePost,
);

/**
 * Regular User Routes
 * Routes that should be inaccessible to administrators
 * Guarded by isNotAdmin - admins are redirected away
 */

// Upgrade account page - hidden from admins
authRouter.get('/upgrade-account', isNotAdmin, authController.authUpgradeGet);

// Regular user settings - admins see different view
authRouter.get(
  '/settings',
  isAuthenticated,
  isNotAdmin,
  authController.authSettingsGet,
);

/**
 * Logout Route
 * Accessible to all (but only useful for logged-in users)
 */

authRouter.get('/log-out', authController.authLogoutGet);

export default authRouter;

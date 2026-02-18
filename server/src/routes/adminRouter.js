/**
 * Admin Router
 * Routes for administrator-only functionality.
 * @module routes/adminRouter
 */
import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const adminRouter = Router();

/**
 * Apply Admin Authorization to ALL routes in this file.
 * Any user who is not logged in OR is not an admin will be rejected here.
 */
adminRouter.use(isAdmin);

// Admin Home
adminRouter.get('/dashboard', adminController.dashboardGet);

// User Management
adminRouter.get('/users', adminController.usersGet);
adminRouter.post('/users/:id/promote', adminController.promotePost);

export default adminRouter;

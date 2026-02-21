/**
 * User Router
 * Handles Dashboard and User Settings.
 * @module routes/userRouter
 */
import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { isAuthenticated, isNotAdmin } from '../middleware/authMiddleware.js';

const userRouter = Router();

// Require login for all user routes
userRouter.use(isAuthenticated);

userRouter.get('/dashboard', isAuthenticated, userController.dashboardGet);

// Specific to non-admins
userRouter.get('/upgrade-account', isNotAdmin, userController.upgradeGet);
userRouter.get('/settings', isNotAdmin, userController.settingsGet);

export default userRouter;

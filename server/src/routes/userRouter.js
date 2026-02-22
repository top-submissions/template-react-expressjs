import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { isAuthenticated, isNotAdmin } from '../middleware/auth/auth.js';

const userRouter = Router();

// Enforce authentication for all sub-routes
userRouter.use(isAuthenticated);

// Standard user entry point
userRouter.get('/dashboard', userController.dashboardGet);

// Feature routes restricted to standard users
userRouter.get('/upgrade-account', isNotAdmin, userController.upgradeGet);
userRouter.get('/settings', isNotAdmin, userController.settingsGet);

export default userRouter;

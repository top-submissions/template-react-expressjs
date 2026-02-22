import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import {
  isAuthenticated,
  isNotAdmin,
} from '../middleware/auth/auth.middleware.js';

const userRouter = Router();

// Enforce authentication for all sub-routes
userRouter.use(isAuthenticated);

// Standard user entry point
userRouter.get('/dashboard', userController.dashboardGet);

// Feature routes restricted to standard users
userRouter.get('/upgrade-account', isNotAdmin, userController.upgradeGet);
userRouter.get('/settings', isNotAdmin, userController.settingsGet);

export default userRouter;

import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import {
  isAuthenticated,
  isNotAdmin,
} from '../middleware/auth/auth.middleware.js';

const userRouter = Router();

// Apply authentication safety net to all routes
userRouter.use(isAuthenticated);

// Identity and Settings Endpoints
userRouter.get('/me', userController.getCurrentUser);
userRouter.get('/profile', userController.profileGet);
userRouter.get('/profile/:id', userController.getUserById);

export default userRouter;

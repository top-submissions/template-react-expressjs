import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { isNotAuthenticated } from '../middleware/auth/auth.middleware.js';
import {
  validateSignup,
  validateLogin,
} from '../validators/auth/auth.validator.js';

const authRouter = Router();

// Public entry point
authRouter.get('/', authController.landingGet);

// Registration flow
authRouter.get('/sign-up', isNotAuthenticated, authController.signupGet);
authRouter.post('/sign-up', validateSignup, authController.signupPost);

// Authentication flow
authRouter.get('/log-in', isNotAuthenticated, authController.loginGet);
authRouter.post('/log-in', validateLogin, authController.loginPost);

// Identity termination
authRouter.get('/log-out', authController.logoutGet);

export default authRouter;

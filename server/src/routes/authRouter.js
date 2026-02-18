/**
 * Authentication Router
 * Handles Login, Signup, and Logout.
 * @module routes/authRouter
 */
import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { isNotAuthenticated } from '../middleware/authMiddleware.js';
import { validateSignup, validateLogin } from '../validators/authValidator.js';

const authRouter = Router();

authRouter.get('/', authController.landingGet);

authRouter.get('/sign-up', isNotAuthenticated, authController.signupGet);
authRouter.post('/sign-up', validateSignup, authController.signupPost);

authRouter.get('/log-in', isNotAuthenticated, authController.loginGet);
authRouter.post('/log-in', validateLogin, authController.loginPost);

authRouter.get('/log-out', authController.logoutGet);

export default authRouter;

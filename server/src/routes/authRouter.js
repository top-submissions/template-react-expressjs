import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = Router();

// Home
authRouter.get('/', authController.authIndexGet);

// Signup
authRouter.get('/sign-up', authController.authSignupGet);
authRouter.post('/sign-up', authController.authSignupPost);

// Login
authRouter.get('/log-in', authController.authLoginGet);
authRouter.post('/log-in', authController.authLoginPost);

// Logout
authRouter.get('/log-out', authController.authLogoutGet);

export default authRouter;

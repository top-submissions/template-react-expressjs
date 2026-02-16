import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = Router();

// Signup
authRouter.get('/sign-up', authController.authSignupGet);
authRouter.post('/sign-up', authController.authSignupPost);

// Login
authRouter.get('/', authController.authLoginGet);
authRouter.post('/log-in', authController.authLoginPost);

export default authRouter;

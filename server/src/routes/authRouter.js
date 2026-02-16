import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.get('/sign-up', authController.authSignupGet);
authRouter.post('/sign-up', authController.authSignupPost);

export default authRouter;

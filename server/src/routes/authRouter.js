import { Router } from 'express';

const authRouter = Router();

authRouter.get('/sign-up', (req, res) => res.render('auth/sign-up-form'));

export default authRouter;

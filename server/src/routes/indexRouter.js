import { Router } from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import adminRouter from './adminRouter.js';

const indexRouter = Router();

// Mounting public and identity routes at root
indexRouter.use('/', authRouter);

// Mounting authenticated user routes at root
indexRouter.use('/', userRouter);

// Mounting administrative routes under prefix
indexRouter.use('/admin', adminRouter);

export default indexRouter;

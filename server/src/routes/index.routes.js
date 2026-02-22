import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import adminRouter from './admin.routes.js';

const indexRouter = Router();

// Mounting public and identity routes at root
indexRouter.use('/', authRouter);

// Mounting authenticated user routes at root
indexRouter.use('/', userRouter);

// Mounting administrative routes under prefix
indexRouter.use('/admin', adminRouter);

export default indexRouter;

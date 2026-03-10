import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import adminRouter from './admin.routes.js';

const indexRouter = Router();

// Mount auth routes
indexRouter.use('/api/auth', authRouter);

// Mounting authenticated user routes at root
indexRouter.use('/', userRouter);

// Mounting administrative routes under prefix
indexRouter.use('/api/admin', adminRouter);

export default indexRouter;

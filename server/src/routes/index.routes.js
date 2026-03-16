import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import adminRouter from './admin.routes.js';

const indexRouter = Router();

// Mount auth routes
indexRouter.use('/api/auth', authRouter);

// Mount user routes
indexRouter.use('/api/user', userRouter);

// Mount administrative routes
indexRouter.use('/api/admin', adminRouter);

export default indexRouter;

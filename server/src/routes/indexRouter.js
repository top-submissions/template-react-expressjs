/**
 * Main Index Router
 * This file collects all sub-routers and exports them as one unit.
 * @module routes/indexRouter
 */
import { Router } from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import adminRouter from './adminRouter.js';

const indexRouter = Router();

// 1. Auth routes (Login, Signup, Logout)
indexRouter.use('/', authRouter);

// 2. Standard User routes (Dashboard, Settings)
indexRouter.use('/', userRouter);

// 3. Admin routes (Prefixed with /admin)
indexRouter.use('/admin', adminRouter);

export default indexRouter;

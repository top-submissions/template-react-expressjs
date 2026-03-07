import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/auth/auth.middleware.js';

const adminRouter = Router();

// Secure all sub-routes with administrator check
adminRouter.use(isAdmin);

// User management routes
adminRouter.get('/users', adminController.usersGet);
adminRouter.post('/users/:id/promote', adminController.promotePost);

export default adminRouter;

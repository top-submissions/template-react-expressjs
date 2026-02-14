import { Router } from 'express';
import * as usersController from '../controllers/usersController.js';

const usersRouter = Router();

// List
usersRouter.get('/', usersController.usersListGet);

// Create
usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.post('/create', usersController.usersCreatePost);

// Update
usersRouter.get('/:id/update', usersController.usersUpdateGet);
usersRouter.post('/:id/update', usersController.usersUpdatePost);

// Delete
usersRouter.post('/:id/delete', usersController.usersDeletePost);

export default usersRouter;

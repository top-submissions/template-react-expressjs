import { Router } from 'express';

const appRouter = Router();

appRouter.get('/', (req, res) => {
  res.render('index', {
    message: 'This is a message from appRouter to index view.',
  });
});

export default appRouter;

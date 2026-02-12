import { Router } from 'express';

const appRouter = Router();

appRouter.get('/', (req, res) => {
  const links = [
    { href: '/', text: 'Home' },
    { href: 'about', text: 'About' },
  ];

  res.render('index', {
    message: 'This is a message from appRouter to index view.',
    links: links,
  });
});

export default appRouter;

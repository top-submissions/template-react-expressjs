import { config } from 'dotenv';
import express from 'express';
import appRouter from './routes/appRouter.js';

config();

const app = express();

app.use('/', appRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server started on port ${PORT}.`);
});

import { config } from 'dotenv';
import express from 'express';
import appRouter from './routes/appRouter.js';

config();

const app = express();

app.use('/', appRouter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server started on port ${PORT}.`);
});

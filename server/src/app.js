import { config } from 'dotenv';
import express from 'express';
import appRouter from './routes/appRouter.js';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// Public assets setup
const assetsPath = path.join(__dirname, '..', 'public');
app.use(express.static(assetsPath));

// Body parsing
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', appRouter);

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(
    `Server started on port ${PORT}.\nView live in http://localhost:${PORT}/`,
  );
});

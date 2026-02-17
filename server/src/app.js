import 'dotenv/config';
import express from 'express';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import session from 'express-session';
import passport from 'passport';
import pgSession from 'connect-pg-simple';
import pool from './db/pool.js';
import './config/passport.js';
import authRouter from './routes/authRouter.js';

const app = express();
const PostgresStore = pgSession(session);

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

// Session setup
app.use(
  session({
    store: new PostgresStore({
      pool: pool,
      tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 Day (in milliseconds)
    },
  }),
);

// Passport setup
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/', authRouter);

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(
    `Server started on port ${PORT}.\nView live in http://localhost:${PORT}/`,
  );
});

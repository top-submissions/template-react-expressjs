import UsersDb from '../db/UsersDb.js';
import { validateUser } from '../validators/usersValidator.js';
import { validationResult, matchedData } from 'express-validator';

export const usersListGet = (req, res) => {
  res.render('users/index', {
    title: 'User list',
    users: UsersDb.getUsers(),
  });
};

export const usersCreateGet = (req, res) => {
  res.render('users/create', {
    title: 'Create user',
  });
};

export const usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('users/create', {
        title: 'Create user',
        errors: errors.array(),
      });
    }
    const { firstName, lastName } = matchedData(req);
    UsersDb.addUser({ firstName, lastName });
    res.redirect('/');
  },
];

export const usersUpdateGet = (req, res) => {
  const user = UsersDb.getUser(req.params.id);
  res.render('users/update', {
    title: 'Update user',
    user: user,
  });
};

export const usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = UsersDb.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('users/update', {
        title: 'Update user',
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName } = matchedData(req);
    UsersDb.updateUser(req.params.id, { firstName, lastName });
    res.redirect('/');
  },
];

export const usersDeletePost = (req, res) => {
  UsersDb.deleteUser(req.params.id);
  res.redirect('/');
};

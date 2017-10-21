const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const Session = require('../models/Session');
const User = require('../models/User');
const Session = require('../models/Session');
const knex = require('../db/conf');
const bcrypt = require('bcrypt');

router.get('/me', (req, res) => {
  // const me = User.getJoey();
  // res.json(me);
  knex('users').where('username', 'jtongay').first().then((user) => {
    res.json(user);
  });
});

router.get('/:id', (req, res) => {
  const id = req.body.id;
  const user = User.getUser(id);
  res.json(user);
});

router.get('/', (req, res) => {
  const users = User.getAllUsers();
  res.json(users);
});

router.post('/new', (req, res) => {
  const request = {
    userName: req.body.userName,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };
  if (!request.password || !request.firstName || !request.lastName) {
    res.status(404).json({
      status: 404,
      message: 'missing required field',
      response: 'error',
      token: null
    });
    return;
  }
  knex('users').where('username', request.userName).orWhere('email', request.email).first().then((result) => {
    // go ahead and create the user if nothing returned
    if (!result) {
      const hashPass = bcrypt.hashSync(request.password, 12);
      knex('users').insert({
        first_name: request.firstName,
        last_name: request.lastName,
        username: request.userName,
        password: hashPass,
        email: request.email
      }).returning('*')
        .then((user) => {
          // sign a token and send it to the FE
          const token = Session.signToken(user.id);
          res.json({
            status: 200,
            message: 'success',
            response: user,
            token
          });
        })
        .catch((err) => {
          // catch an error if it happens. Maybe a different status code?
          res.json({
            status: 404,
            message: 'failure',
            response: err,
            token: null
          });
        });
    } else {
      // throw an error if the username already exists
      res.json({
        status: 404,
        message: 'username or email already exists',
        response: 'error',
        token: null
      });
    }
  });
});

module.exports = router;

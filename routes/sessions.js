const express = require('express');

const router = express.Router({
  mergeParams: true
});
const Session = require('../models/Session');
const knex = require('../db/conf');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(400).json({
      status: 400,
      message: 'you must enter a username and password',
      token: null
    });
    return;
  }
  knex('users').where('username', username).first().then((result) => {
    // if there is no one with that username, don't do a password check and present a server error
    if (!result) {
      res.status(404).json({
        status: 404,
        message: 'incorrect username/password',
        token: null
      });
      return;
    }
    // if there is someone with that username, do a password check
    bcrypt.compare(password, result.password, (err, match) => {
      // if password's don't match, present a server error
      if (!match) {
        res.status(404).json({
          status: 404,
          message: 'incorrect username/password',
          token: null
        });
        return;
      }
      // if passwords match, sign a token and send it to the FE
      const token = Session.signToken(result.id);
      res.status(200).json({
        status: 200,
        message: 'success',
        token
      });
    });
  });
});

module.exports = router;

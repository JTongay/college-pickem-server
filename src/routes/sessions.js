const express = require('express');

const router = express.Router({
  mergeParams: true
});
const Session = require('../models/Session');
const knex = require('../../db/conf');
const bcrypt = require('bcrypt');

/**
 * @api {post} /session/login Logs a user in
 * @apiName Login
 * @apiGroup Auth

 * @apiParam {Object} request The payload of the request.
 * @apiParam {String} request.userName The username of a given user
 * @apiParam {String} request.password The users password

 * @apiSuccess {Number} status Status code
 * @apiSuccess {String} message Success Message
 * @apiSuccess {String} token Access token
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       message: "success",
 *       token: "access token"
 *      }
 * @apiError MissingRequiredField The required fields of userName or password are empty
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       status: 400,
 *       message: "you must enter a username and password",
 *       token: null
 *     }
 * @apiError IncorrectUsername/Password The username or password were incorrect
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       message: 'incorrect username/password',
 *       token: null
 *     }
 */

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

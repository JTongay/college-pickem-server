const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const Session = require('../models/Session');
// const User = require('../models/User');
const Session = require('../models/Session');
const knex = require('../db/conf');
const bcrypt = require('bcrypt');

//apd-example
/**
 * @api {get} users/me Request main test user
 * @apiName GetJoey
 * @apiGroup testing
 *
 */
router.get('/me', (req, res) => {
  // const me = User.getJoey();
  // res.json(me);
  knex('users').where('username', 'jtongay').first().then((user) => {
    res.json(user);
  });
});

/**
 * @api {get} users/:id Request single user by id
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object} response Successful response object with user data
 * @apiSuccess {Number} response.id Users unique id
 * @apiSuccess {String} response.first_name Users first name
 * @apiSuccess {String} response.last_name Users last name
 * @apiSuccess {String} response.username Users user name
 * @apiSuccess {String} response.email Users email
 * @apiSuccess {String} response.password Users hashed password
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       response: {
 *        id: 1,
 *        first_name: "firstName",
 *        last_name: "lastName",
 *        username: "userName",
 *        email: "someEmail@email.com",
 *        password: "hashed password",
 *        created_at: "2017-12-10T02:33:07.444Z",
 *        updated_at: "2017-12-10T02:33:07.444Z"
 *       },
 *       message: "success"
 *     }
 * @apiError UserNotFound The id of the User was not found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "no user found with id: 100",
 *       message: "error"
 *     }
 */

router.get('/:id', (req, res) => {
  const id = req.params.id;
  knex('users').where('id', id).first().then((user) => {
    if (!user) {
      res.status(404).json({
        status: 404,
        response: `no user found with id: ${id}`,
        message: 'error'
      });
    } else {
      res.status(200).json({
        status: 200,
        response: user,
        message: 'success'
      });
    }
  });
});

router.get('/', (req, res) => {
  knex('users').then((users) => {
    res.status(200).json({
      response: users,
      status: 200,
      message: 'success'
    });
  });
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

const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const Session = require('../models/Session');
const User = require('../models/User');
const Session = require('../models/Session');
const knex = require('../db/conf');
const bcrypt = require('bcrypt');
const request = require('request-promise');

// apd-example
router.get('/me', (req, res) => {
  User.getJoey()
    .then((data) => {
      res.json(data);
    })
    .catch(e => res.json(e));
});

router.get('/test', (req, res) => {
  const options = {
    uri: 'https://api.foxsports.com/sportsdata/v1/football/cfb/events.json',
    qs: {
      season: '2018',
      seasonType: 'reg',
      top: '25',
      week: '1',
      enable: 'teamdetails'
    },
    headers: {
      'User-Agent': 'Request-Promise',
      'X-Api-Key': process.env.NEWS_API_KEY
    }
  };
  console.log(process.env.NEWS_API_KEY);
  request(options).then((data) => {
    res.send(data);
  }).catch((e) => {
    res.send(e)
  });
});

/**
 * @api {get} /users/:id Request single user by id
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

/**
 * @api {get} /users/ Request all users
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object[]} response Successful response object with user data
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
 *       response: [
 *                  {
 *                    id: 1,
 *                    first_name: "Joey",
 *                    last_name: "Tongay",
 *                    username: "jtongay",
 *                    email: "joseph.tongay@gmail.com",
 *                    password: "hashedPassword",
 *                    created_at: "2017-12-10T02:33:07.444Z",
 *                    updated_at: "2017-12-10T02:33:07.444Z"
 *                  },
 *                  {
 *                    id: 2,
 *                    first_name: "Erin",
 *                    last_name: "Miller",
 *                    username: "emiller",
 *                    email: "erin.miller@junkmail.gmail.com",
 *                    password: "hashedPassword",
 *                    created_at: "2017-12-10T02:33:07.444Z",
 *                    updated_at: "2017-12-10T02:33:07.444Z"
 *                  }
 *                ],
 *                status: 200,
 *                message: "success"
 *               }
 * @apiError UsersNotFound The response of no users found or an error grabbing them.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "e",
 *       message: "Had a hard time finding users"
 *     }
 */

router.get('/', (req, res) => {
  knex('users').then((users) => {
    res.status(200).json({
      response: users,
      status: 200,
      message: 'success'
    });
  })
    .catch((e) => {
      res.status(404).json({
        response: e,
        status: 200,
        message: 'Had a hard time finding users'
      });
    });
});

/**
 * @api {post} /users/new Creates a new user
 * @apiName CreateUser
 * @apiGroup Users

 * @apiParam {Object} request The payload of the request.
 * @apiParam {String} request.firstName The desired first name of the new user
 * @apiParam {String} request.lastName The desired last name of the new user
 * @apiParam {String} request.userName The desired username of the new user
 * @apiParam {String} request.password The desired password of the new user to be hashed
 * @apiParam {String} request.email The users email address

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
 * @apiSuccess {String} token Access token
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       response: {
 *                    id: 1,
 *                    first_name: "firstName",
 *                    last_name: "lastName",
 *                    username: "userName",
 *                    email: "someEmail@email.com",
 *                    password: "hashedPassword",
 *                    created_at: "2017-12-10T02:33:07.444Z",
 *                    updated_at: "2017-12-10T02:33:07.444Z"
 *                  },
 *       status: 200,
 *       message: "success",
 *       token: "access token"
 *      }
 * @apiError MissingRequiredField The required fields of userName,
 * firstName, lastName, password, or email are empty
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "error",
 *       message: "missing required field",
 *       token: null
 *     }
 * @apiError UsernameOrEmailExists The username or email already exists
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       message: 'username or email already exists',
 *       response: 'error',
 *       token: null
 *     }
 */

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

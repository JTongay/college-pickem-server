const knex = require('../db/conf');
// const knex = require('knex')(config);
const bcrypt = require('bcrypt');
const Session = require('./Session');

const getUser = (id) => {
  knex('users').where('id', id).first()
    .then(user => user)
    .catch(err => err);
};

const getAllUsers = () => {
  knex('users').then(user => user).catch(err => err);
};

const createUser = (request) => {
  knex('users').where('username', request.userName).first().then((result) => {
    // go ahead and create the user if nothing returned
    if (!result) {
      const hashPass = bcrypt.hashSync(request.password, 12);
      knex('users').insert({
        first_name: request.firstName,
        last_name: request.lastName,
        username: request.userName,
        password: hashPass,
        email: request.email
      }).then((user) => {
        console.log(user, 'getting in here');
        // sign a token and send it to the FE
        const token = Session.signToken(user.id);
        return {
          status: 200,
          message: 'success',
          response: user,
          token
        };
      })
        .catch(err => ({
          // catch an error if it happens. Maybe a different status code?
          status: 404,
          message: 'failure',
          response: err,
          token: null
        }));
    }
    // throw an error if the username already exists
    return {
      status: 404,
      message: 'username already exists',
      response: 'error',
      token: null
    };
  });
};

const editUser = (id, username, password) => {
  const updateParams = {
    username,
    password
  }
  knex('users').where('id', id)
    .first()
    .update(updateParams)
    .returning('*')
    .then(user => user);
};

const createTestUser = (request) => {
  let test;
  knex('users').where('username', request.userName).first().then((user) => {
    console.log(user);
    if (!user) {
      const hashPass = bcrypt.hashSync(request.password, 12);
      knex('users')
        .returning('*')
        .insert({
          first_name: request.firstName,
          last_name: request.lastName,
          username: request.userName,
          password: hashPass,
          email: request.email
        })
        .then((createdUser) => {
          console.log(createUser, 'createdUser');
          test = createdUser;
          return test;
        });
    }
  });
  return test;
};

const getJoey = () => {
  return new Promise((resolve, reject) => {
    knex('users').where('username', 'jtongay').first()
      .then(user => resolve(user))
      .catch(e => reject(e));
  });
};

// const deleteUser = (id) => {
//   knex('users').where('id', id).first().del()
// }

const User = {
  getUser,
  getAllUsers,
  createUser,
  editUser,
  createTestUser,
  getJoey
};

module.exports = User;

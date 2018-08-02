const knex = require('../../db/conf');
// const knex = require('knex')(config);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login Method
const login = (user, pass) => {
  knex('users').where('username', user).first().then((result) => {
    // if there is no one with that username, don't do a password check and present a server error
    if (!result) {
      return {
        status: 404,
        messsage: 'incorrect username/password',
        token: null
      };
    }
    // if there is someone with that username, do a password check
    bcrypt.compare(pass, result.password, (err, match) => {
      // if password's don't match, present a server error
      if (!match) {
        return {
          status: 404,
          messsage: 'incorrect username/password',
          token: null
        };
      }
      // if passwords match, sign a token and send it to the FE
      const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET);
      return {
        status: 200,
        message: 'success',
        token
      };
    });
  });
};
// Sign/Check Tokens
const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET);
const checkToken = token => jwt.verify(token, process.env.JWT_SECRET);

const missingUsernamePass = () => ({
  status: 400,
  message: 'you must enter a username and password',
  token: null
});

const Session = {
  login,
  signToken,
  checkToken,
  missingUsernamePass
};

module.exports = Session;

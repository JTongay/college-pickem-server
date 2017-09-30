const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const knex = require('knex')(config);

const getUserMethod = user => user;

const User = {
  getUser: getUserMethod
};

module.exports = User;

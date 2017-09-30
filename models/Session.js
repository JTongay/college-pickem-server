const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const knex = require('knex')(config);

// Some Login Method
const login = () => login;

const Session = {
  login
};

module.exports = Session;

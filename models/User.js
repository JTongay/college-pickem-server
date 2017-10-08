const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const knex = require('knex')(config);

const getUser = (id) => {
  knex('users').where('id', id).first()
    .then(user => user)
    .catch(err => err);
};

const User = {
  getUser
};

module.exports = User;

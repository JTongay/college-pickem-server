const bcrypt = require('bcrypt');

const hashedPass = bcrypt.hashSync('password', 12);

const userData = [
  {
    first_name: 'Joey',
    last_name: 'Tongay',
    username: 'jtongay',
    email: 'joseph.tongay@gmail.com',
    password: hashedPass
  },
  {
    first_name: 'Erin',
    last_name: 'Miller',
    username: 'emiller',
    email: 'erin.miller@junkmail.gmail.com',
    password: hashedPass
  },
  {
    first_name: 'Rupert',
    last_name: 'Collett',
    username: 'rcollet',
    email: 'rupert.collett@junkmail.gmail.com',
    password: hashedPass
  },
  {
    first_name: 'Nathan',
    last_name: 'Massey',
    username: 'nmassey',
    email: 'nathan.massey@junkmail.gmail.com',
    password: hashedPass
  }
];

module.exports = userData;

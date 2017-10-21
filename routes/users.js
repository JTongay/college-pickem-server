const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const Session = require('../models/Session');
const User = require('../models/User');

router.get('/:id', (req, res) => {
  const id = req.body.id;
  const user = User.getUser(id);
  res.json(user);
});

router.get('/', (req, res) => {
  const users = User.getAllUsers();
  res.json(users);
});

router.post('/new', (req, res) => {
  const requestBody = {
    userName: req.body.userName,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };
  console.log(requestBody);
  const createdUser = User.createUser(requestBody);
  console.log(createdUser);
  res.json(createdUser);
});

module.exports = router;

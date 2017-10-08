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

module.exports = router;

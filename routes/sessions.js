const express = require('express');

const router = express.Router({
  mergeParams: true
});
const Session = require('../models/Session');

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const login = Session.login(username, password);
  res.status(login.status).json(login);
});

module.exports = router;

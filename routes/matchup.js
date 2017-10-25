const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

router.get('/', (req, res) => {
  knex('matchups').then((match) => {
    res.json(match);
  });
});

module.exports = router;

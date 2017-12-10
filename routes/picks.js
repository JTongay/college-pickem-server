const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

router.post('/', (req, res) => {
  const userId = req.params.user_id;
  const seasonId = req.params.season_id;
  knex('user_pick').where('user_id', userId).andWhere('season_id', seasonId)
    .innerJoin('users', 'user_pick.user_id', 'users.id')
    .then((user) => {
      res.json(user);
    });
});

module.exports = router;

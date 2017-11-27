const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const Session = require('../models/Session');
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');
// const bcrypt = require('bcrypt');

/*
@Params season_id
returns a list of scores by week for all users in a given season
*/
router.get('/:id', (req, res) => {
  const seasonId = req.params.season_id;
  const weekId = req.params.id;
  knex('user_score')
    .where('season_id', seasonId)
    .andWhere('week', weekId)
    .join('users', 'user_score.user_id', 'users.id')
    .then((scores) => {
      res.status(200).json({
        scores
      });
    });
});

module.exports = router;

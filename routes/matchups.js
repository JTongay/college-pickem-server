const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

router.get('/', (req, res) => {
  const seasonId = req.params.season_id;
  knex('matchups').where('season_id', seasonId).innerJoin('seasons', 'matchups.season_id', 'seasons.id').then((match) => {
    console.log(match);
    res.status(200).json({
      match
    });
  });
});

// router.get('/:id', (req, res) => {
//   knex('matchups')
// });

module.exports = router;

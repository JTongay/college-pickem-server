const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

router.get('/', (req, res) => {
  knex('seasons').then((match) => {
    res.json(match);
  });
});

router.post('/create', (req, res) => {
  knex('seasons').insert({
    league: req.body.league,
    start_date: req.body.startDate,
    end_date: req.body.endDate,
    active_season: true
  }).then((result) => {
    res.json(result);
  });
});

router.patch('/activate', (req, res) => {
  const requestID = req.body.id;
  // knex('seasons').where('id', requestID).first().then((season) => {
  //   res
  // });
});

module.exports = router;

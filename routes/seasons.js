const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

router.get('/', (req, res) => {
  knex('seasons').then((season) => {
    if (!season) {
      res.status(404).json({
        status: 404,
        response: 'unexpected error occured',
        message: 'error'
      });
      return;
    }
    res.status(200).json({
      status: 200,
      response: season,
      message: 'success'
    });
  });
});

router.get('/:id', (req, res) => {
  const paramsID = req.params.id;
  knex('seasons').where('id', paramsID)
    .first()
    .then((season) => {
      if (!season) {
        res.status(404).json({
          status: 404,
          response: `no season found with id ${paramsID}`,
          message: 'error'
        });
        return;
      }
      res.status(200).json({
        status: 200,
        response: season,
        message: 'success'
      });
    });
});

router.post('/create', (req, res) => {
  knex('seasons').insert({
    league: req.body.league,
    start_date: req.body.startDate,
    end_date: req.body.endDate,
    active_season: true
  }).returning('*')
    .first()
    .then((season) => {
      res.status(200).json({
        status: 200,
        response: season,
        message: 'success'
      });
    }).catch((err) => {
      res.status(404).json({
        status: 404,
        response: err,
        message: 'success'
      });
    });
});

router.put('/edit', (req, res) => {
  const requestID = req.body.id;
  knex('seasons').where('id', requestID)
    .first()
    .update({
      league: req.body.league,
      start_date: req.body.startDate,
      end_date: req.body.endDate,
      active_season: req.body.activated
    })
    .then((season) => {
      res.json(season);
    });
});

router.put('/activate', (req, res) => {
  const requestID = req.body.id;
  knex('seasons').where('id', requestID)
    .first()
    .update({
      active_season: true
    })
    .then((season) => {
      res.json(season);
    });
});

router.put('/deactivate', (req, res) => {
  const requestID = req.body.id;
  knex('seasons').where('id', requestID)
    .first()
    .update({
      active_season: false
    })
    .then((season) => {
      res.json(season);
    });
});

router.delete('/destroy', (req, res) => {
  const requestID = req.body.id;
  knex('seasons').where('id', requestID)
    .first()
    .del()
    .then(() => {
      res.json({
        message: 'success'
      });
    });
});

module.exports = router;

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
  if (!req.body.league) {
    res.status(404).json({
      status: 404,
      response: 'you must send NFL or NCAA',
      message: 'error'
    });
    return;
  }
  knex('seasons').insert({
    league: req.body.league,
    start_date: req.body.startDate,
    end_date: req.body.endDate,
    active_season: true
  }).returning('*')
    .then((season) => {
      res.status(200).json({
        status: 200,
        response: season[0],
        message: 'success'
      });
    })
    .catch((err) => {
      res.status(404).json({
        status: 404,
        response: err,
        message: 'error'
      });
    });
});

router.put('/activate', (req, res) => {
  const requestID = req.body.id;
  knex('seasons').where('id', requestID).first().then((seas) => {
    if (!seas) {
      res.status(404).json({
        status: 404,
        response: `no season found with id: ${requestID}`,
        message: 'error'
      });
      return;
    }
    knex('seasons').where('id', requestID)
      .first()
      .update({
        active_season: true
      })
      .returning('*')
      .then((season) => {
        res.status(200).json({
          status: 200,
          response: season[0],
          message: 'season is now active'
        });
      });
  });
});

router.put('/deactivate', (req, res) => {
  const requestID = req.body.id;
  console.log(req.body);
  // console.log(requestID);
  knex('seasons').where('id', requestID).first().then((seas) => {
    if (!seas) {
      res.status(404).json({
        status: 404,
        response: `no season found with id: ${requestID}`,
        message: 'error'
      });
      return;
    }
    knex('seasons').where('id', requestID)
      .first()
      .update({
        active_season: false
      })
      .returning('*')
      .then((season) => {
        res.status(200).json({
          status: 200,
          response: season[0],
          message: 'season is now inactive'
        });
      });
  });
});

/*
@Params id of season
*/
router.put('/:id', (req, res) => {
  const requestID = req.params.id;
  knex('seasons').where('id', requestID).first().then((season) => {
    if (!season) {
      res.status(404).json({
        status: 404,
        response: `no season found with id: ${requestID}`,
        message: 'error'
      });
    } else {
      knex('seasons')
        .where('id', requestID)
        .update({
          league: req.body.league,
          start_date: req.body.startDate,
          end_date: req.body.endDate,
          active_season: req.body.activated
        })
        .returning('*')
        .then((seasonFound) => {
          res.status(200).json({
            status: 200,
            response: seasonFound[0],
            message: 'success'
          });
        });
    }
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

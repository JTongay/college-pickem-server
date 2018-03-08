const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

/**
 * @api {get} /season Request all seasons
 * @apiName GetSeason
 * @apiGroup Seasons
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object[]} response Successful response object with season data
 * @apiSuccess {Number} response.id Seasons unique id
 * @apiSuccess {String} response.league Seasons league (NFL or NCAA only)
 * @apiSuccess {Date} response.start_date Date of seasons start
 * @apiSuccess {Date} response.end_date Date of seasons end
 * @apiSuccess {Boolean} response.active_seasons Seasons active or inactive
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       response: [
 *                  {
 *                    id: 2,
 *                    league: "NFL",
 *                    start_date: "2017-10-15T05:00:00.000Z",
 *                    end_date: "2018-02-25T06:00:00.000Z",
 *                    active_season: true,
 *                    created_at: "2017-12-10T02:33:07.447Z",
 *                    updated_at: "2017-12-10T02:33:07.447Z"
 *                  },
 *                  {
 *                    id: 1,
 *                    league: "NCAA",
 *                    start_date: "2017-10-06T05:00:00.000Z",
 *                    end_date: "2018-02-11T06:00:00.000Z",
 *                    active_season: true,
 *                    created_at: "2017-12-10T02:33:07.447Z",
 *                    updated_at: "2017-12-10T02:33:07.447Z"
 *                  }
 *                ],
 *                status: 200,
 *                message: "success"
 *               }
 * @apiError SeasonsNotFound The response of no seasons found or an error grabbing them.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "unexpected error occured",
 *       message: "error"
 *     }
 */

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

/**
 * @api {get} /season/college Request current college season
 * @apiName GetCurrentCollegeSeason
 * @apiGroup Seasons
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object} response Successful response object with season data
 * @apiSuccess {Number} response.id Seasons unique id
 * @apiSuccess {String} response.league Seasons league (NFL or NCAA only)
 * @apiSuccess {Date} response.start_date Date of seasons start
 * @apiSuccess {Date} response.end_date Date of seasons end
 * @apiSuccess {Boolean} response.active_seasons Seasons active or inactive
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       response: {
 *         id: 1,
 *         league: "NCAA",
 *         start_date: "2017-10-06T05:00:00.000Z",
 *         end_date: "2018-02-11T06:00:00.000Z",
 *         active_season: true,
 *         created_at: "2017-12-10T02:33:07.447Z",
 *         updated_at: "2017-12-10T02:33:07.447Z"
 *        },
 *       message: "success"
 *     }
 * @apiError SeasonNotFound No current season was found or unexpected error
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "unexpected error occured",
 *       message: "error"
 *     }
 */

router.get('/college', (req, res) => {
  knex('seasons')
    .where('league', 'NCAA')
    .andWhere('active_season', true)
    .first()
    .then((season) => {
      res.status(200).json({
        status: 200,
        response: season,
        message: 'success'
      });
    })
    .catch((e) => {
      res.status(404).json({
        status: 404,
        response: 'unexpected error occured',
        message: 'error'
      });
    });
});

/**
 * @api {get} /season/nfl Request current nfl season
 * @apiName GetCurrentNflSeason
 * @apiGroup Seasons
 *
 * @apiSuccess {Number} status Status code
 * @apiSuccess {Object} response Successful response object with season data
 * @apiSuccess {Number} response.id Seasons unique id
 * @apiSuccess {String} response.league Seasons league (NFL or NCAA only)
 * @apiSuccess {Date} response.start_date Date of seasons start
 * @apiSuccess {Date} response.end_date Date of seasons end
 * @apiSuccess {Boolean} response.active_seasons Seasons active or inactive
 * @apiSuccess {Date} response.created_at Date of users account creation
 * @apiSuccess {Date} response.updated_at Date of users last update
 * @apiSuccess {String} message Success Message
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       status: 200,
 *       response: {
 *         id: 2,
 *         league: "NFL",
 *         start_date: "2017-10-06T05:00:00.000Z",
 *         end_date: "2018-02-11T06:00:00.000Z",
 *         active_season: true,
 *         created_at: "2017-12-10T02:33:07.447Z",
 *         updated_at: "2017-12-10T02:33:07.447Z"
 *        },
 *       message: "success"
 *     }
 * @apiError SeasonNotFound No current season was found or unexpected error
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       status: 404,
 *       response: "unexpected error occured",
 *       message: "error"
 *     }
 */
router.get('/nfl', (req, res) => {
  knex('seasons')
    .where('league', 'NFL')
    .andWhere('active_season', true)
    .first()
    .then((season) => {
      res.status(200).json({
        status: 200,
        response: season,
        message: 'success'
      });
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

router.get('/active-seasons', (req, res) => {
  knex('seasons')
    .where('active_season', true)
    .first()
    .then((season) => {
      res.status(200).json(season);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

/*
- Returns a season by id
*/

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

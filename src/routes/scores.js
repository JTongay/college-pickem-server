const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const Session = require('../models/Session');
// const IUserController = require('../models/IUserController');
// const Session = require('../models/Session');
const knex = require('../../db/conf');
// const bcrypt = require('bcrypt');

/*
@Params season_id, user_id
- Grabs all scores for a given season and user
*/
router.get('/users/:user_id/all', (req, res) => {
  const seasonId = req.params.season_id;
  const userId = req.params.user_id;
  knex('users')
    .where('id', userId)
    .first()
    .then((user) => {
      knex('user_score')
        .where('season_id', seasonId)
        .andWhere('user_id', user.id)
        .then((scores) => {
          res.status(200).json({
            user,
            scores
          });
        });
    });
});

/*
@Params season_id, user_id
- Grabs the latest weeks score for a given user and season
*/
router.get('/users/:user_id/latest', (req, res) => {
  const seasonId = req.params.season_id;
  const userId = req.params.user_id;
  knex('users')
    .where('id', userId)
    .first()
    .then((user) => {
      knex('user_score')
        .where('season_id', seasonId)
        .andWhere('user_id', user.id)
        .orderBy('week', 'desc')
        .limit(1)
        .first()
        .then((score) => {
          res.status(200).json({
            user,
            score
          });
        });
    });
});

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

/*
@Params season_id, week
- Returns a leaderboard for a given season
*/
router.get('/:id/leaderboard', (req, res) => {
  const weekId = +req.params.id;
  const seasonId = +req.params.season_id;
  knex('user_score')
    .where('season_id', seasonId)
    .andWhere('week', weekId)
    .orderBy('total_score', 'desc')
    .join('users', 'user_score.user_id', 'users.id')
    .then((scores) => {
      res.status(200).json(scores);
    });
});

module.exports = router;

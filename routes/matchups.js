const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

router.get('/', (req, res) => {
  const seasonId = req.params.season_id;
  knex('matchups').where('season_id', seasonId).innerJoin('seasons', 'matchups.season_id', 'seasons.id')
    .then((match) => {
      knex('teams').innerJoin('matchups', 'teams.id', 'matchups.home_team_id')
        .then((homeTeam) => {
          knex('teams').innerJoin('matchups', 'teams.id', 'matchups.away_team_id')
            .then((awayTeam) => {
              const showMatches = match.map((game, index) => {
                const away = {
                  team_name: awayTeam[index].team_name,
                  abbr_name: awayTeam[index].abbr_name,
                  league: awayTeam[index].league,
                  record: awayTeam[index].record,
                  rank: awayTeam[index].rank
                };
                const home = {
                  team_name: homeTeam[index].team_name,
                  abbr_name: homeTeam[index].abbr_name,
                  league: homeTeam[index].league,
                  record: homeTeam[index].record,
                  rank: homeTeam[index].rank
                };
                game.away_team = away; // eslint-disable-line no-param-reassign
                game.home_team = home; // eslint-disable-line no-param-reassign
                return game;
              });
              res.status(200).json({
                showMatches
              });
            });
        });
    });
});

// router.get('/:id', (req, res) => {
//   knex('matchups')
// });

module.exports = router;

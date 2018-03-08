const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

/*
@Params season_id
- Returns a list of of matchups in a given season
*/
router.get('/', (req, res) => {
  const seasonId = req.params.season_id;
  knex('matchups').where('season_id', seasonId).innerJoin('seasons', 'matchups.season_id', 'seasons.id')
    .then((match) => {
      knex('matchups').where('season_id', seasonId).join('teams', 'matchups.home_team_id', 'teams.id')
        .then((homeTeam) => {
          knex('matchups').where('season_id', seasonId).join('teams', 'matchups.away_team_id', 'teams.id')
            .then((awayTeam) => {
              match.forEach((game, index) => {
                const away = {
                  id: match.away_team_id,
                  team_name: awayTeam[index].team_name,
                  abbr_name: awayTeam[index].abbr_name,
                  locale: awayTeam[index].locale,
                  league: awayTeam[index].league,
                  record: awayTeam[index].record,
                  rank: awayTeam[index].rank,
                  team_id: awayTeam[index].away_team_id
                };
                const home = {
                  id: match.home_team_id,
                  team_name: homeTeam[index].team_name,
                  abbr_name: homeTeam[index].abbr_name,
                  locale: homeTeam[index].locale,
                  league: homeTeam[index].league,
                  record: homeTeam[index].record,
                  rank: homeTeam[index].rank,
                  team_id: homeTeam[index].home_team_id
                };
                game.away_team = away; // eslint-disable-line no-param-reassign
                game.home_team = home; // eslint-disable-line no-param-reassign
              });
              res.status(200).json({
                match
              });
            });
        });
    });
});

router.get('/:id', (req, res) => {
  const seasonId = req.params.season_id;
  const weekId = req.params.id;
  knex('matchups').where('season_id', seasonId).andWhere('week', weekId).orderBy('match', 'asc')
    .then((matches) => {
      knex('matchups').where('season_id', seasonId).join('teams', 'matchups.home_team_id', 'teams.id')
        .orderBy('match', 'asc')
        .then((homeTeam) => {
          knex('matchups').where('season_id', seasonId).join('teams', 'matchups.away_team_id', 'teams.id')
            .orderBy('match', 'asc')
            .then((awayTeam) => {
              matches.forEach((game, index) => {
                const away = {
                  team_name: awayTeam[index].team_name,
                  abbr_name: awayTeam[index].abbr_name,
                  locale: awayTeam[index].locale,
                  league: awayTeam[index].league,
                  record: awayTeam[index].record,
                  rank: awayTeam[index].rank,
                  team_id: awayTeam[index].away_team_id
                };
                const home = {
                  team_name: homeTeam[index].team_name,
                  abbr_name: homeTeam[index].abbr_name,
                  locale: homeTeam[index].locale,
                  league: homeTeam[index].league,
                  record: homeTeam[index].record,
                  rank: homeTeam[index].rank,
                  team_id: homeTeam[index].home_team_id
                };
                game.away_team = away; // eslint-disable-line no-param-reassign
                game.home_team = home; // eslint-disable-line no-param-reassign
              });
              res.status(200).json({
                matches
              });
            });
        });
    });
});

module.exports = router;

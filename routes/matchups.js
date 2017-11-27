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
      console.log(match);
      console.log('-------------------------------------');
      knex('matchups').where('season_id', seasonId).join('teams', 'matchups.home_team_id', 'teams.id')
        .then((homeTeam) => {
          knex('matchups').where('season_id', seasonId).join('teams', 'matchups.away_team_id', 'teams.id')
            .then((awayTeam) => {
              match.forEach((game, index) => {
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
                console.log(index);
              });
              console.log(awayTeam[0], "away");
              console.log(homeTeam[0], "home");
              res.status(200).json({
                match
              });
            });
        });
    });
});

// router.get('/:id', (req, res) => {
//   knex('matchups')
// });

module.exports = router;

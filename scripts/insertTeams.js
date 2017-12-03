const knex = require('../db/conf');
const fs = require('fs');

function insertTeams(league, week, year) {
  fs.readFile(`json/week_${week}_year_${year}_${league.toLowerCase()}.json`, 'utf-8', (err, data) => {
    if (err) throw err;
    const games = JSON.parse(data);
    games.forEach((game) => {
      // AWAY TEAM
      knex('teams')
        .where('abbr_name', game.away.abbrev)
        .first()
        .then((team) => {
          // If there are no teams with that name, create it
          if (!team) {
            // check to see if the team is ranked or not first before entering in DB
            if (game.away.rank === 'unranked') {
              knex('teams')
                .insert({
                  team_name: game.away.team_name,
                  abbr_name: game.away.abbrev,
                  league,
                  locale: game.away.team_location.join(' '),
                  record: game.away.record
                })
                .then(t => t);
            } else {
              knex('teams')
                .insert({
                  team_name: game.away.team_name,
                  abbr_name: game.away.abbrev,
                  league,
                  record: game.away.record,
                  locale: game.away.team_location.join(' '),
                  rank: game.away.rank
                })
                .then(t => t);
            }
          } else {
            // update existing teams rank and record if they exist
            if (game.away.rank === 'unranked') {
              // make their rank null and update record
              knex('teams')
                .where('abbr_name', team.abbr_name)
                .andWhere('league', 'NCAA')
                .first()
                .update({
                  rank: null,
                  record: game.away.record
                });
              return;
            }
            knex('teams')
              .where('abbr_name', team.abbr_name)
              .andWhere('league', 'NCAA')
              .first()
              .update({
                rank: game.away.rank,
                record: game.away.record
              });
          }
        });

      // HOME TEAM
      knex('teams')
        .where('abbr_name', game.home.abbrev)
        .first()
        .then((team) => {
          // If there are no teams with that name, create it
          if (!team) {
            // check to see if the team is ranked or not first before entering in DB
            if (game.home.rank === 'unranked') {
              knex('teams')
                .insert({
                  team_name: game.home.team_name,
                  abbr_name: game.home.abbrev,
                  league,
                  locale: game.home.team_location.join(' '),
                  record: game.home.record
                })
                .then(t => t);
            } else {
              knex('teams')
                .insert({
                  team_name: game.home.team_name,
                  abbr_name: game.home.abbrev,
                  league,
                  record: game.home.record,
                  locale: game.home.team_location.join(' '),
                  rank: game.home.rank
                })
                .then(t => t);
            }
          } else {
            // update existing teams rank and record if they exist
            if (game.home.rank === 'unranked') {
              // make their rank null and update record
              knex('teams')
                .where('abbr_name', team.abbr_name)
                .andWhere('league', 'NCAA')
                .first()
                .update({
                  rank: null,
                  record: game.home.record
                })
                .then(res => res);
              return;
            }
            knex('teams')
              .where('abbr_name', team.abbr_name)
              .andWhere('league', 'NCAA')
              .first()
              .update({
                rank: game.home.rank,
                record: game.home.record
              })
              .then(res => res);
          }
        });
    });
  });
}

insertTeams('NCAA', '1', '2017');

module.exports = insertTeams;

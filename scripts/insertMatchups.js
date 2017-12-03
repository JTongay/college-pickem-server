const knex = require('../db/conf');
const fs = require('fs');

function insertMatchups (league, week, year, seasonId) {
  fs.readFile(`json/week_${week}_year_${year}_${league}.json`, 'utf-8', (err, data) => {
    if (err) throw err;
    const games = JSON.parse(data);
    games.forEach((game, index) => {
      // Add the matchups
      knex('teams').where('abbr_name', game.away.abbrev).andWhere('league', 'NCAA').first().then((awayTeam) => {
        knex('teams').where('abbr_name', game.home.abbrev).andWhere('league', 'NCAA').first().then((homeTeam) => {
          if (!awayTeam || !homeTeam) {
            console.log(`problem with ${game.away.abbrev} or ${game.home.abbrev}`);
          } else {
            knex('matchups')
              .insert({
                season_id: seasonId,
                home_team_id: homeTeam.id,
                away_team_id: awayTeam.id,
                week,
                match: index + 1,
                location: game.stadium
              })
              .then(res => res)
              .catch(mis => mis);
          }
        });
      });
    });
  });
}

insertMatchups('ncaa', '1', '2017', '1');

module.exports = insertMatchups;

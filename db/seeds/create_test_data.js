const seasons = require('../dummyData/seasons');
const nflTeams = require('../dummyData/nflTeams');

exports.seed = (knex, Promise) =>
  // Deletes ALL existing entries
  knex.raw('TRUNCATE TABLE teams RESTART IDENTITY CASCADE')
    .then(() =>
      // Inserts seed entries
      Promise.all([
        knex('seasons').insert(seasons).then(res => res),
        knex('teams').insert(nflTeams).then(res => res)
      ]).then(() => {
        console.log('success');
      })
    )
;

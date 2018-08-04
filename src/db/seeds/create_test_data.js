const seasons = require('../dummyData/seasons');
const nflTeams = require('../dummyData/nflTeams');
const collegeTeams = require('../dummyData/collegeTeams');
const matchups = require('../dummyData/matchups');
const users = require('../dummyData/users');
const userScores = require('../dummyData/userScores');
const picksData = require('../dummyData/picks');
const teamSeasons = require('../dummyData/teamSeasons');

exports.seed = async function (knex, Promise) {
  // Deletes ALL existing entries
  // knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  //   .then(() =>
  //     knex.raw('TRUNCATE TABLE seasons RESTART IDENTITY CASCADE')
  //       .then(() =>
  //         knex.raw('TRUNCATE TABLE teams RESTART IDENTITY CASCADE')
  //           .then(() =>
  //             knex.raw('TRUNCATE TABLE matchups RESTART IDENTITY CASCADE')
  //               .then(() =>
  //                 knex.raw('TRUNCATE TABLE user_score RESTART IDENTITY CASCADE')
  //                   .then(() =>
  //                   // Inserts seed entries
  //                     Promise.all([
  //                       knex('users').insert(users).then(res => res),
  //                       knex('seasons').insert(seasons).then(res => res),
  //                       knex('teams').insert(nflTeams).then(res => res),
  //                       knex('teams').insert(collegeTeams).then(res => res),
  //                       knex('matchups').insert(matchups).then(res => res),
  //                       knex('user_pick').insert(picksData).then(res => res),
  //                       knex('user_score').insert(userScores).then(res => res)
  //                     ]).then(() => {
  //                       console.log('success'); //eslint-disable-line
  //                     })
  //                   )
  //               )
  //           )
  //       )
  //   )
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  console.log('Truncating users');
  await knex.raw('TRUNCATE TABLE seasons RESTART IDENTITY CASCADE');
  console.log('Truncating seasons');
  await knex.raw('TRUNCATE TABLE teams RESTART IDENTITY CASCADE');
  console.log('Truncating teams');
  await knex.raw('TRUNCATE TABLE matchups RESTART IDENTITY CASCADE');
  console.log('Truncating matchups');
  await knex.raw('TRUNCATE TABLE user_score RESTART IDENTITY CASCADE');
  console.log('Truncating user_score');
  await knex('users').insert(users).then(res => console.log(`inserted ${res}`));
  await knex('seasons').insert(seasons).then(res => console.log(`inserted ${res}`));
  await knex('teams').insert(nflTeams).then(res => console.log(`inserted ${res}`));
  await knex('teams').insert(collegeTeams).then(res => console.log(`inserted ${res}`));
  await knex('matchups').insert(matchups).then(res => console.log(`inserted ${res}`));
  await knex('user_pick').insert(picksData).then(res => console.log(`inserted ${res}`));
  await knex('user_score').insert(userScores).then(res => console.log(`inserted ${res}`));
  await knex('team_season').insert(teamSeasons).then(res => console.log(`inserted ${res}`));
};

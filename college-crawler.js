const request = require('tinyreq');
const cheerio = require('cheerio');
const _ = require('lodash');
const knex = require('./db/conf');


const reqWeek = req.params.week;
const reqYear = req.params.year;

request(`http://www.foxsports.com/college-football/schedule?season=${reqYear}&seasonType=1&week=${reqWeek}&group=0`, (err, body) => {
  if (err) {
    console.log(err);
  }
  const $ = cheerio.load(body, {
    normalizeWhitespace: true,
    xmlMode: true
  });
  const teams = [];
  const stadiums = [];
  // Get the text of every span inside of each a tag in the schedule table
  $('.wisbb_scheduleTable a').each((i, table) => {
    const team = $(table).find('span').text();
    teams.push(team.trim());
  });

  $('.wisbb_scheduleTable td').each((i, table) => {
    const stadium = $(table).find('div.wisbb_location').text();
    stadiums.push(stadium.trim());
  });

  // filter out empty strings
  const teamsFiltered = teams.filter(str => str !== '');
  const stadiumsFiltered = stadiums.filter(str => str !== '');
  // loop through the array and create object every 3 elements
  const schedule = _.chunk(teamsFiltered, 3);
  // create an object is awayTeam, location, and homeTeam
  // TODO create score property if the game is over? Maybe have it look for the word 'final'
  schedule.forEach((match, i) => {
    const game = {};
    const splitAway = match[0].split(' ').filter(el => el !== '');
    const splitHome = match[2].split(' ').filter(el => el !== '');
    const splitTime = match[1].split(' ');
    game.away = {};
    game.home = {};
    // Rank property
    game.away.rank = +splitAway[0] ? +splitAway[0] : 'unranked';
    game.home.rank = +splitHome[0] ? +splitHome[0] : 'unranked';

    // Abbrev property
    game.away.abbrev = (game.away.rank === 'unranked') ? splitAway[0] : splitAway[1];
    game.home.abbrev = (game.home.rank === 'unranked') ? splitHome[0] : splitHome[1];

    // Record property
    game.away.record = splitAway[splitAway.length - 1].match(/\(([^)]+)\)/)[1];
    game.home.record = splitHome[splitHome.length - 1].match(/\(([^)]+)\)/)[1];

    // Team Name property
    game.away.team_name = splitAway[splitAway.length - 1].replace(/[^a-zA-Z\s!?]+/g, '');
    game.home.team_name = splitHome[splitHome.length - 1].replace(/[^a-zA-Z\s!?]+/g, '');

    // Team Location property
    game.away.team_location = (game.away.rank === 'unranked') ? splitAway.slice(1, splitAway.length - 1) : splitAway.slice(2, splitAway.length - 1);
    game.home.team_location = (game.home.rank === 'unranked') ? splitHome.slice(1, splitHome.length - 1) : splitHome.slice(2, splitHome.length - 1);

    if (splitTime[0].includes('FINAL')) {
      const awayScore = +splitTime[0].split('').map(Number).filter((el => !isNaN(el))).join('');
      const homeScoreFormat = splitTime[2].replace(awayScore.toString(), '');
      const homeScore = +homeScoreFormat.substr(0, homeScoreFormat.length / 2);
      game.away.score = awayScore;
      game.home.score = homeScore;
      game.time = 'final';
    } else {
      // Date/Time/Location property
      game.time = splitTime;
    }

    // Stadium Property
    game.stadium = stadiumsFiltered[i];

    // ---------- Insert information to database -----------------
    // AWAY TEAM
    knex('teams').where('abbr_name', game.away.abbrev).first().then((team) => {
      // If there are no teams with that name, create it
      if (!team) {
        // check to see if the team is ranked or not first before entering in DB
        if (game.away.rank === 'unranked') {
          knex('teams').insert({
            team_name: game.away.team_name,
            abbr_name: game.away.abbrev,
            location: game.away.team_location.join(' '),
            record: game.away.record
          }).then(t => t);
        } else {
          knex('teams').insert({
            team_name: game.away.team_name,
            abbr_name: game.away.abbrev,
            record: game.away.record,
            location: game.away.team_location.join(' '),
            rank: game.away.rank
          }).then(t => t);
        }
      } else {
        // update existing teams rank and record if they exist
        if (game.away.rank === 'unranked') {
          // make their rank null and update record
          knex('teams').where('abbr_name', team.abbr_name).first().update({
            rank: null,
            record: game.away.record
          });
          return;
        }
        knex('teams').where('abbr_name', team.abbr_name).first().update({
          rank: game.away.rank,
          record: game.away.record
        });
      }
    });

    // HOME TEAM
    knex('teams').where('abbr_name', game.home.abbrev).first().then((team) => {
      // If there are no teams with that name, create it
      if (!team) {
        // check to see if the team is ranked or not first before entering in DB
        if (game.home.rank === 'unranked') {
          knex('teams').insert({
            team_name: game.home.team_name,
            abbr_name: game.home.abbrev,
            location: game.home.team_location.join(' '),
            record: game.home.record
          }).then(t => t);
        } else {
          knex('teams').insert({
            team_name: game.home.team_name,
            abbr_name: game.home.abbrev,
            record: game.home.record,
            location: game.home.team_location.join(' '),
            rank: game.home.rank
          }).then(t => t);
        }
      } else {
        // update existing teams rank and record if they exist
        if (game.home.rank === 'unranked') {
          // make their rank null and update record
          knex('teams').where('abbr_name', team.abbr_name).first().update({
            rank: null,
            record: game.home.record
          });
          return;
        }
        knex('teams').where('abbr_name', team.abbr_name).first().update({
          rank: game.home.rank,
          record: game.home.record
        });
      }
    });

    // Insert the matchup
    // knex('matchups').where('week', )

    // Assign game object to each row
    schedule[i] = game;
  });
});

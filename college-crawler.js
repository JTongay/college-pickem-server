const request = require('tinyreq');
const cheerio = require('cheerio');
const _ = require('lodash');
const knex = require('./db/conf');
const moment = require('moment');
const memwatch = require('memwatch-next');
const fs = require('fs');
const currentYear = moment().year()

function scrapeCollege(year, week, seasonId) {
  request(`http://www.foxsports.com/college-football/schedule?season=${year}&seasonType=1&week=${week}&group=0`, (err, body) => {
    if (err) {
      console.log(err); // eslint-disable-line
    }
    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
      xmlMode: true
    });
    const teams = [];
    const stadiums = [];
    // Get the text of every span inside of each a tag in the schedule table
    $('.wisbb_scheduleTable a')
      .each((i, table) => {
        const team = $(table)
          .find('span')
          .text();
        teams.push(team.trim());
      });

    $('.wisbb_scheduleTable td')
      .each((i, table) => {
        const stadium = $(table)
          .find('div.wisbb_location')
          .text();
        stadiums.push(stadium.trim());
      });

    // filter out empty strings
    const teamsFiltered = teams.filter(str => str !== '');
    const stadiumsFiltered = stadiums.filter(str => str !== '');
    // loop through the array and create object every 3 elements
    const schedule = _.chunk(teamsFiltered, 3);
    // create an object is awayTeam, location, and homeTeam
    for (let i = 0; i < schedule.length; i += 1) {
      const game = {};
      const splitAway = schedule[i][0].split(' ').filter(el => el !== '');
      const splitHome = schedule[i][2].split(' ').filter(el => el !== '');
      const splitTime = schedule[i][1].split(' ');
      let matchNumber = 1;
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
        const awayScore = +splitTime[0].split('')
          .map(Number)
          .filter((el => !isNaN(el)))
          .join('');
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
      schedule[i] = game;
    }
    console.log(schedule);
    fs.writeFile(`${__dirname}/json/week_${week}_year_${year}_ncaa.json`, JSON.stringify(schedule), 'utf-8', (errorMessage) => {
      console.log(errorMessage);
    });
    return schedule;
  });
}

scrapeCollege(currentYear, 1, 2);

module.exports = scrapeCollege;

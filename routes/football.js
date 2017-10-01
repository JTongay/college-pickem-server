const express = require('express');

const router = express.Router({
  mergeParams: true
});
const request = require('tinyreq');
const cheerio = require('cheerio');
const _ = require('lodash');

const getCollegeSchedule = (url, data, cb) => {
  request(url, (err, body) => {
    if (err) {
      return cb(err);
    }
    const $ = cheerio.load(body);
    const pageData = {};

    Object.keys(data).forEach((k) => {
      pageData[k] = $(data[k]).text();
    });

    return cb(null, pageData);
  });
};

router.get('/ncaa/:year/:week', (req, res) => {
  const reqWeek = req.params.week;
  const reqYear = req.params.year;

  request(`http://www.foxsports.com/college-football/schedule?season=${reqYear}&seasonType=1&week=${reqWeek}&group=0`, (err, body) => {
    if (err) {
      res.json(err);
    }
    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
      xmlMode: true
    });
    const teams = [];
    // Get the text of every span inside of each a tag in the schedule table
    $('.wisbb_scheduleTable a').each((i, table) => {
      const team = $(table).find('span').text();
      teams.push(team.trim());
    });
    // filter out empty strings
    const teamsFiltered = teams.filter(str => str !== '');
    // loop through the array and create object every 3 elements
    const schedule = _.chunk(teamsFiltered, 3);
    // create an object is awayTeam, location, and homeTeam
    // TODO create score property if the game is over? Maybe have it look for the word 'final'
    schedule.forEach((match, i) => {
      const game = {};
      const splitAway = match[0].split(' ').filter(el => el !== '');
      const splitHome = match[2].split(' ').filter(el => el !== '');
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


      game.away.team = match[0];
      game.location = match[1];
      game.home.team = match[2];
      schedule[i] = game;
    });
    // Send it out
    res.json({
      schedule
    });
  });
});


router.get('/football', (req, res) => {
  const teams = {
    awayTeams: '.wisbb_firstTeam a',
    homeTeams: '.wisbb_secondTeam a'
  };

  const url = 'http://www.foxsports.com/college-football/schedule?season=2017&seasonType=1&week=5&group=0';

  getCollegeSchedule(url, teams, (err, data) => {
    res.json(data)
  });
});

module.exports = router;

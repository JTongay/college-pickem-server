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

router.get('/cb', (req, res) => {
  request('http://www.foxsports.com/college-football/schedule?season=2017&seasonType=1&week=5&group=0', (err, body) => {
    if (err) {
      res.json(err);
    }
    const $ = cheerio.load(body);
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
    schedule.forEach((match, i) => {
      const game = {};
      game.awayTeam = match[0];
      game.location = match[1];
      game.homeTeam = match[2];
      schedule[i] = game;
    });
    res.json({
      home: schedule
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

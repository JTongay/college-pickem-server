const express = require('express');

const router = express.Router({
  mergeParams: true
});
const request = require('tinyreq');
const cheerio = require('cheerio');

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
    let teamName;
    const $ = cheerio.load(body);
    const homeTeams = $('.wisbb_fullTeamStacked').filter((i, ele) =>{
      const data = $(this);
      console.log(data.children().first().children().text())
      teamName = data.children().first().children().first().next().text();
    });
    res.json({
      home: teamName
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

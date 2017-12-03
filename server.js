const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const cron = require('node-cron');
const ejs = require('ejs');
const nodeMailer = require('nodemailer');
const collegeCrawler = require('./college-crawler');
const insertTeams = require('./scripts/insertTeams');
const moment = require('moment');
const fs = require('fs');
const knex = require('./db/conf');
require('dotenv').config();

// Middleware
const bodyParser = require('body-parser');

// Routes
const football = require('./routes/football');
const users = require('./routes/users');
const session = require('./routes/sessions');
const season = require('./routes/seasons');
const matchups = require('./routes/matchups');
const scores = require('./routes/scores');


// Use Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Use Routes
app.use('/api', football);
app.use('/api/users', users);
app.use('/api/session', session);
app.use('/api/season', season);
app.use('/api/season/:season_id/score', scores);
app.use('/api/season/:season_id/matchup', matchups);

// Crons
cron.schedule('* * * Feb,Aug Sun', () => {
  /*
  Send an email out every sunday from February to August
  reminding me to set the start dates for each league
  */
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD
    }
  });
  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: process.env.APP_EMAIL,
    subject: 'Test Email',
    html: '<h1>Heres a friendly reminder</h1>'
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err); // eslint-disable-line
    } else {
      console.log(info); // eslint-disable-line
    }
  });
});

// College Scoring
cron.schedule('* * * Aug,Dec Mon', () => {
  /*
  Do the scoring for college every monday from August to December. Make sure you have it
  check if the season is active or not.
  */
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD
    }
  });
  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: process.env.APP_EMAIL,
    subject: 'Test Email',
    html: '<h1>Heres an email for scoring NCAA</h1>'
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err); // eslint-disable-line
    } else {
      console.log(info); // eslint-disable-line
    }
  });
});

// NFL scoring
cron.schedule('* * * Sep,Jan Tue', () => {
  /*
  Do the scoring for nfl game every tuesday from September to January. Make sure you
  have it check if the season is active or not.
  */
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD
    }
  });
  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: process.env.APP_EMAIL,
    subject: 'Test Email',
    html: '<h1>Heres an email for scoring NFLr</h1>'
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err); // eslint-disable-line
    } else {
      console.log(info); // eslint-disable-line
    }
  });
});

// College scraping
cron.schedule('* * 12 Aug,Dec Tue', () => {
  /*
  Do the scraping for ncaa game every tuesday at noon from September to January. Make sure you
  have it check if the season is active or not.
  */
  const currentYear = moment().year();
  const mainData = fs.readFileSync(`${__dirname}/json/dates.json`, 'utf-8');
  const parsed = JSON.parse(mainData);
  collegeCrawler(currentYear, parsed.currentWeek, parsed.collegeSeasonId);
});

// Insert each new json file into db
cron.schedule('* * 13 Aug,Dec Tue', () => {
  /*
  Do the DB stuff for each game every tuesday at 1pm from September to January. Make sure you
  have it check if the season is active or not.
  */
  const currentYear = moment().year();
  const mainData = fs.readFileSync(`${__dirname}/json/dates.json`, 'utf-8');
  const parsed = JSON.parse(mainData);
  insertTeams('ncaa', parsed.currentWeek, currentYear);
});

// Start the server
app.listen(port, () => {
  console.log('Hello from port ', port); //eslint-disable-line
  console.log('Starting in mode ', environment); //eslint-disable-line
});


module.exports = app;

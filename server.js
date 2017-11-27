const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const cron = require('node-cron');
const nodeMailer = require('nodemailer');
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
app.use('/api/season/:season_id', scores);
app.use('/api/season/:season_id/matchup', matchups);

// Crons
cron.schedule('* * * Feb,Aug Sun', () => {
  /*
  Send an email out every sunday from February to August
  reminding me to set the start dates for each league
  */
});

// Start the server
app.listen(port, () => {
  // eslint-disable no-alert, no-console
  console.log('Hello from port ', port);
  console.log('Starting in mode ', environment);
  // eslint-enable no-alert
});


module.exports = app;

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
require('dotenv').config();

// Middleware
const bodyParser = require('body-parser');

// Use Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.user((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(port, () => {
  // eslint-disable no-alert, no-console
  console.log('Hello from port ', port);
  console.log('Starting in mode ', environment);
  // eslint-enable no-alert
});

module.exports = app;

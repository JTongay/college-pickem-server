const moment = require('moment');

const seasons = [
  {
    league: 'NCAA',
    start_date: moment().year('2017').month('09').date('05'),
    end_date: moment().year('2018').month('01').date('10'),
    active_season: true
  },
  {
    league: 'NFL',
    start_date: moment().year('2017').month('09').date('14'),
    end_date: moment().year('2018').month('01').date('24'),
    active_season: true
  }
];

module.exports = seasons;

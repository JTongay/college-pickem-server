const request = require('request-promise');

const getScheduleByWeek = (week, year) => {
  const options = {
    uri: 'https://api.foxsports.com/sportsdata/v1/football/cfb/events.json',
    qs: {
      season: year,
      seasonType: 'reg',
      top: '25',
      week,
      enable: 'teamdetails',
      apikey: process.env.NEWS_API_KEY
    },
    headers: {
      'User-Agent': 'Request-Promise'
    }
  };
  return new Promise((resolve, reject) => {

  })
};

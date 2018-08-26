// const moment = require('moment');
// const start = moment().year('2017').month('09').date('05');
// const end = moment().year('2018').month('01').date('10');
// const currentYear = moment().year();
// const fs = require('fs');
// const knex = require('./db/conf');
// const collegeCrawler = require('./college-crawler');
import { CollegeCrawler } from './crawlers/college.crawler';

// fs.readFile(`${__dirname}/json/dates.json`, (err, data) => {
//   if (err) throw err;
//   // currentWeek = parsed.currentWeek;
//   return data;
// });
//
// const currentWeek = fs.readFileSync(`${__dirname}/json/dates.json`, 'utf-8');
//
// const currentSeason = knex('seasons').where('league', 'NCAA').andWhere('active_season', true).first().then((season) => {
//   console.log(season)
//   return season;
// });


// console.log(start);
// console.log(end);
// console.log(currentYear);
// console.log(JSON.parse(currentWeek).currentWeek, 'currentWeek');
// console.log(currentSeason, 'currentSeason')

// const currentYear = moment().year();
// const mainData = fs.readFileSync(`${__dirname}/json/dates.json`, 'utf-8');
// const parsed = JSON.parse(mainData);
// collegeCrawler(currentYear, parsed.currentWeek, parsed.collegeSeasonId);
CollegeCrawler.Scrape('2017', '1');

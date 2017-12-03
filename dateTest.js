const moment = require('moment');
const start = moment().year('2017').month('09').date('05');
const end = moment().year('2018').month('01').date('10');
const currentYear = moment().year();
const fs = require('fs');
// let currentWeek;

fs.readFile(`${__dirname}/json/dates.json`, (err, data) => {
  if (err) throw err;
  // currentWeek = parsed.currentWeek;
  return data;
});

const currentWeek = fs.readFileSync(`${__dirname}/json/dates.json`, 'utf-8');


// console.log(start);
// console.log(end);
console.log(currentYear);
console.log(JSON.parse(currentWeek).currentWeek, 'currentWeek');

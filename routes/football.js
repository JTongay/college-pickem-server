const express = require('express');

const router = express.Router({
  mergeParams: true
});
const request = require('request');
const cheerio = require('cheerio');

router.get('/football', (req, res) => {
  request('http://www.nfl.com/schedules', (error, response, html) => {
    console.log('booyah');
    if (!error) {
      const $ = cheerio.load(html, {
        normalizeWhitespace: false
      });
      // console.log($('body').children().text());
      // console.log($('.away', 'body').text());
      // console.log($('span[class="team-name"]', '.list-matchup-row-team').toArray());
      // console.log($('span[class=\'team-name away\']', this).length);
      $('li').each((i, ele) => {
        console.log(ele);
        console.log(i);
      });
      res.json({ yo: 'yo' });
    }
  });
});

module.exports = router;

const express = require('express');

const router = express.Router({
  mergeParams: true
});
const request = require('request');
const cheerio = require('cheerio');

router.get('/football', (req, res) => {
  request('https://github.com/', (error, response, html) => {
    console.log('booyah');
    if (!error) {
      // const $ = cheerio.load(html, {
      //   normalizeWhitespace: false
      // });
      let $ = cheerio.load("<h2 class='title'>Hello world</h2>");
      console.log($("h2.title").text());
      let lists = [];
      // console.log($('body').children().text());
      // console.log($('span[class="team-name"]', '.list-matchup-row-team').toArray());
      // console.log($('span[class=\'team-name away\']', this).length);
      // $('.team-name').each((i, ele) => {
      //   lists[i] = $(this).text();
      //   console.log($(this).text());
      // });
      // console.log(lists)
      // console.log($("h2.title").text());
      // console.log($('.shelf-title', '.shelf-content').text());
      res.json({ yo: lists });
    }
  });
});

module.exports = router;

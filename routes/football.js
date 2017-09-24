const express = require('express');

const router = express.Router({
  mergeParams: true
});
const request = require('request');
const cheerio = require('cheerio')

router.get('/football', (req, res) => {
  request('', (error, response, html) => {
    if (!error) {
      let $ = cheerio.load(html);
      return $
    }
  });
});

module.exports = router;

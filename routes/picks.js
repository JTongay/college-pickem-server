const express = require('express');

const router = express.Router({
  mergeParams: true
});
// const User = require('../models/User');
// const Session = require('../models/Session');
const knex = require('../db/conf');

router.post('/', (req, res) => {
  // const userId = req.params.user_id;
  // const seasonId = req.params.season_id;
  const requestBody = req.body;
  knex('user_pick')
    .insert(requestBody)
    .then(() => {
      res.status(200).json({
        message: 'success'
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: `something went wrong: ${err}`
      });
    });
});

module.exports = router;

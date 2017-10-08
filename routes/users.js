const express = require('express');

const router = express.Router({
  mergeParams: true
});
const Session = require('../models/Session');
const User = require('../models/User');

router.get('/:id', (req, res) => {
  
})

module.exports = router;

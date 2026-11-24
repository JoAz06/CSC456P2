const express = require('express');
const router = express.Router();
const logger = require('../logger');

router.get('/', logger.getLogs);

module.exports = router;
const express = require('express');
const router = express.Router();
const borrowRecordController = require('../controllers/borrowRecordController');

router.get('/:recordId', borrowRecordController.getOne);
router.patch('/:recordId/return', borrowRecordController.returnOne);

module.exports = router;

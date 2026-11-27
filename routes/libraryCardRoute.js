const express = require('express');
const router = express.Router();
const libraryCardController = require('../controllers/libraryCardController');
const borrowRecordController = require('../controllers/borrowRecordController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', libraryCardController.getAll);
router.get('/:cardId', libraryCardController.getOne);
router.post('/', libraryCardController.addOne);
router.put('/:cardId', libraryCardController.updateOne);
router.delete('/:cardId', libraryCardController.deleteOne);
router.get('/:cardId/borrow-records', borrowRecordController.getForCard);
router.post('/:cardId/borrow-records', borrowRecordController.addToCard);

module.exports = router;

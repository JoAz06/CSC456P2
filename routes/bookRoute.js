const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', bookController.getAll);
router.get('/:isbn', bookController.getOne);
router.post('/', bookController.addOne);
router.put('/:isbn', bookController.updateOne);
router.delete('/:isbn', bookController.deleteOne);
router.post('/:isbn/genre/:name', bookController.addGenre);
router.delete('/:isbn/genre/:name', bookController.removeGenre);

module.exports = router;
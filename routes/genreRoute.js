const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', genreController.getAll);
router.get('/:name', genreController.getOne);
router.post('/', genreController.addOne);
router.put('/:name', genreController.updateOne);
router.delete('/:name', genreController.deleteOne);

module.exports = router;
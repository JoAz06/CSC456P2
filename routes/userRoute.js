const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', isAdmin, userController.getAll);
router.get('/:userId', isAdmin, userController.getOne);
router.post('/', isAdmin, userController.addOne);
router.put('/:userId', isAdmin, userController.updateOne);
router.delete('/:userId', isAdmin, userController.deleteOne);


module.exports = router;

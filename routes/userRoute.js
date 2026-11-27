const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { populateUser, authenticateToken, isAdmin } = require('../index');

router.get('/', authenticateToken, isAdmin, userController.getAll);
router.get('/:userId', authenticateToken, isAdmin, userController.getOne);
router.post('/', authenticateToken, isAdmin, userController.addOne);
router.put('/:userId', authenticateToken, isAdmin, userController.updateOne);
router.delete('/:userId', authenticateToken, isAdmin, userController.deleteOne);


module.exports = router;

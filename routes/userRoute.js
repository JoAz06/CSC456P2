const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAll);
router.get('/:userId', userController.getOne);
router.post('/', userController.addOne);
router.put('/:userId', userController.updateOne);
router.delete('/:userId', userController.deleteOne);

module.exports = router;

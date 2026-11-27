const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get("/login", loginController.renderLogin);
router.post("/login", loginController.login);
router.get("/register", loginController.renderRegister);
router.post("/register", loginController.register);
router.get("/logout", loginController.logout);


module.exports = router;

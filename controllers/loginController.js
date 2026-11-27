const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userService = require('../services/userService');
const libraryCardService = require('../services/libraryCardService');
const Logger = require('../logger');

function jwtGenAuth(user){
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );
}

exports.renderLogin = (req, res) => {
    res.render("account/login", {user: req.user || null});
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).render("account/login", {error: "Invalid Credentials"});

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).render("account/login", {error: "Invalid Credentials"});

    const token = jwtGenAuth(user);

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};

exports.renderRegister = (req, res) => {
    res.render("account/register", {user: req.user || null});
};

exports.register = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Register new user');
        let cardData = {cardNumber: Date.now(), issueDate: Date.now()};
        if (req.body.expiryDate) cardData.expiryDate = req.body.expiryDate;
        const card = await libraryCardService.addOne(cardData);
        let userData = {...req.body, libraryCard: card._id};
        const user = await userService.addOne(userData);
        const token = jwtGenAuth(user);
        // Store token in cookie
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/");
    } catch (err) {
        res.status(400).render("account/register", {error: err.message}); // Maybe better error handling for later
    }
};
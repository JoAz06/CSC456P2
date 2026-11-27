require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

function populateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        req.user = err ? null : user;
        next();
    });
}
app.use(populateUser);

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/account/login");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid or expired token");
        req.user = user;
        next();
    });
}

function isAdmin(req, res, next) {
    if (req.user.role === "admin") return next();
    res.status(403).send("Access denied");
}

module.exports = { populateUser, authenticateToken, isAdmin };
// const { populateUser, authenticateToken, isAdmin } = require('../index');


async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/LibraryDB');
        console.log('MongoDB connected');

        const genreRouter = require('./routes/genreRoute');
        app.use('/genre', genreRouter);
        const bookRouter = require('./routes/bookRoute');
        app.use('/book', bookRouter);
        const userRouter = require('./routes/userRoute');
        app.use('/user', userRouter);
        const libraryCardRouter = require('./routes/libraryCardRoute');
        app.use('/library-card', libraryCardRouter);
        const borrowRecordRouter = require('./routes/borrowRecordRoute');
        app.use('/borrow-record', borrowRecordRouter);
        const loginRouter = require('./routes/loginRoute');
        app.use('/account', loginRouter);

        app.get('/', (req, res) => {
            res.render('index', { title: 'Home Page', message: 'Welcome to EJS!', user: req.user || null });
        });

        app.listen(3000, () => console.log('Server running on port 3000'));

        app.use((req, res) => {
            res.status(404).send("Page not found");
        });

        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send("Internal Server Error");
        });
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
}

main();
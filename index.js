const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const userController = require('./controllers/userController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/LibraryDB');
        console.log('MongoDB connected');

        app.set('view engine', 'ejs');
        app.set('views', './views');
        app.use(express.static(path.join(__dirname, 'public')));

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

        app.get('/', (req, res) => {
            res.render('index', { title: 'Home Page', message: 'Welcome to EJS!' });
        });

        app.get('/users', userController.getAll);

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
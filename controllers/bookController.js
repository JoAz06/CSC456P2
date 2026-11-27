const bookService = require('../services/bookService');
const genreService = require('../services/genreService');
const Logger = require('../logger');

function escapeWord(word){
    return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sendError(res, err) {
    Logger.log('CONTROLLER', 'Error : ' + err.message);
    const statusCode = err.statusCode || (err.code === 11000 ? 409 : 400); // 11000 = duplicate in database, 409 = conflict, 400 = bad request
    res.status(statusCode).json({ error: err.message });
}

exports.getAll = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get all books');
        const books = await bookService.getAll();
        // res.status(200).json(books);
        res.render('book/all', { title: "Book Page", books});
    } catch (err) {
        sendError(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get book with ISBN : '+req.params.isbn);
        const book = await bookService.getOne(escapeWord(req.params.isbn));
        const genres = await genreService.getAll();
        const ownedIds = book.genres.map(g => (g._id || g).toString());
        const availableGenres = genres.filter(g => !ownedIds.includes(g._id.toString()));
        // res.status(200).json(book);
        res.render('book/single', { title: book.title, book, availableGenres})
    } catch (err) {
        sendError(res, err);
    }
};

exports.addOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add new book with data : '+JSON.stringify(req.body));
        const book = await bookService.addOne(req.body);
        // res.status(201).json(book);
        res.status(201).redirect("/book");
    } catch (err) {
        sendError(res, err);
    }
};

exports.updateOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Update book with ISBN : '+req.params.isbn+' and data : '+JSON.stringify(req.body));
        const book = await bookService.updateOne(escapeWord(req.params.isbn), req.body);
        res.status(200).json(book);
    } catch (err) {
        sendError(res, err);
    }
};

exports.deleteOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Delete book with ISBN : '+req.params.isbn);
        await bookService.deleteOne(escapeWord(req.params.isbn));
        // res.status(204).send();
        res.redirect("all");
    } catch (err) {
        sendError(res, err);
    }
};

exports.addGenre = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add genre : '+req.params.name+'to book with ISBN : '+req.params.isbn);
        const book = await bookService.addGenre(escapeWord(req.params.isbn), escapeWord(req.params.name));
        // res.status(201).json(book);
        res.redirect("/book/"+req.params.isbn.toString());
    } catch (err) {
        sendError(res, err);
    }
};

exports.removeGenre = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Remove genre : '+req.params.name+'from book with ISBN : '+req.params.isbn);
        const book = await bookService.removeGenre(escapeWord(req.params.isbn), escapeWord(req.params.name));
        // res.status(200).json(book);
        res.status(204).send();
    } catch (err) {
        sendError(res, err);
    }
};
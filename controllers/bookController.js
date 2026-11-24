const bookService = require('../services/bookService');
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
        res.status(200).json(books);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get book with ISBN : '+req.params.isbn);
        const book = await bookService.getOne(escapeWord(req.params.isbn));
        res.status(200).json(book);
    } catch (err) {
        sendError(res, err);
    }
};

exports.addOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add new book with data : '+JSON.stringify(req.body));
        const book = await bookService.addOne(req.body);
        res.status(201).json(book);
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
        res.status(204).send();
    } catch (err) {
        sendError(res, err);
    }
};

exports.addGenre = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add genre : '+req.params.name+'to book with ISBN : '+req.params.isbn);
        const book = await bookService.addGenre(escapeWord(req.params.isbn), escapeWord(req.params.name));
        res.status(201).json(book);
    } catch (err) {
        sendError(res, err);
    }
};

exports.removeGenre = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Remove genre : '+req.params.name+'from book with ISBN : '+req.params.isbn);
        const book = await bookService.removeGenre(escapeWord(req.params.isbn), escapeWord(req.params.name));
        res.status(200).json(book);
    } catch (err) {
        sendError(res, err);
    }
};
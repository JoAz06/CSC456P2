const Book = require('../models/Book');
const Genre = require('../models/Genre');
const BorrowRecord = require('../models/BorrowRecord');
const Logger = require('../logger');

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

exports.getAll = async () => {
    try {
        return await Book.find().populate('genres','-books');
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.getOne = async (isbn) => {
    try {
        const book = await Book.findOne({ isbn }).populate('genres', '-books');
        if (!book) throw createError('No Book with ISBN : ' + isbn, 404);
        return book;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.addOne = async (data) => {
    try {
        const { genres, isBorrowed, hasBorrowHistory, ...allowedUpdates } = data;
        return await Book.create(allowedUpdates);
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.updateOne = async (bookisbn, data) => {
    try {
        const { isbn, genres, isBorrowed, hasBorrowHistory, ...allowedUpdates } = data;
        const book = await Book.findOneAndUpdate(
            { isbn: bookisbn },
            { $set: allowedUpdates },
            { returnDocument: 'after', runValidators: true }
        ).populate('genres', '-books');
        if (!book) throw createError('No Book with ISBN : ' + bookisbn, 404);
        return book;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};
    
exports.deleteOne = async (bookisbn) => {
    try {
        const book = await Book.findOne({ isbn: bookisbn });
        if (!book) throw createError('No Book with ISBN : ' + bookisbn, 404);

        if (book.hasBorrowHistory) {
            throw createError('Cannot delete a book with an active loan or borrowing history', 409);
        }
        await Book.deleteOne({ _id: book._id });

        if (book.genres && book.genres.length > 0) {
            await Genre.updateMany(
                { _id: { $in: book.genres } },
                { $pull: { books: book._id } }
            );
        }

        return book;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.addGenre = async (bookisbn, genreName) => {
    try {
        const genre = await Genre.findOne({ name: new RegExp('^' + genreName + '$', 'i') });
        if (!genre) throw createError('No Genre with name : ' + genreName, 404);
        const updatedBook = await Book.findOneAndUpdate(
            { isbn: bookisbn },
            { $addToSet: { genres:  genre._id } },
            {returnDocument: 'after', runValidators: true}).populate('genres','-books');
        if (!updatedBook) throw createError('No Book with ISBN : ' + bookisbn, 404);
        genre.books.push(updatedBook._id);
        await genre.save();
        return updatedBook;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.removeGenre = async (bookisbn, genreName) => {
    try {
        const genre = await Genre.findOne({ name: new RegExp('^' + genreName + '$', 'i') });
        if (!genre) throw createError('No Genre with name : ' + genreName, 404);
        const updatedBook = await Book.findOneAndUpdate(
            { isbn: bookisbn },
            { $pull: { genres: genre._id } },
            {returnDocument: 'after', runValidators: true}).populate('genres','-books');
        if (!updatedBook) throw createError('No Book with ISBN : ' + bookisbn, 404);
        genre.books.pull(updatedBook._id);
        await genre.save();
        return updatedBook;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};
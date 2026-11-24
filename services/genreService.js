const Genre = require('../models/Genre');
const Book = require('../models/Book');
const Logger = require('../logger');

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

exports.getAll = async () => {
    try {
        return await Genre.find().populate('books','-genres');
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.getOne = async (genrename) => {
    try {
        const genre = await Genre.findOne({ name: new RegExp('^' + genrename + '$', 'i') }).populate('books','-genres');
        if (!genre) throw createError('No Genre with name ' + genrename, 404);
        return genre;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.addOne = async (data) => {
    try {
        const { books, ...allowedUpdates } = data;
        return await Genre.create(allowedUpdates);
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.updateOne = async (genrename, data) => {
    try {
        const { name, books, ...allowedUpdates } = data;
        const genre = await Genre.findOneAndUpdate(
            { name: new RegExp('^' + genrename + '$', 'i') },
            { $set: allowedUpdates },
            {returnDocument: 'after', runValidators: true}).populate('books','-genres');
        if (!genre) throw createError('No Genre with name ' + genrename, 404);
        return genre;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};

exports.deleteOne = async (genrename) => {
    try {
        const genre = await Genre.findOneAndDelete({ name: new RegExp('^' + genrename + '$', 'i') });
        if (!genre) throw createError('No Genre with name ' + genrename, 404);
        if (genre.books && genre.books.length > 0) await Book.updateMany({ _id: { $in: genre.books } }, { $pull: { genres: genre._id } });
        return genre;
    }
    catch (err) {
        Logger.log('SERVICE', 'Error : '+err.message);
        throw err
    }
};
const mongoose = require('mongoose');
const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const LibraryCard = require('../models/LibraryCard');
const Logger = require('../logger');

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function validateId(id, label) {
    if (!mongoose.isValidObjectId(id)) {
        throw createError(`Invalid ${label}`, 400);
    }
}

exports.getForCard = async (cardId) => {
    try {
        validateId(cardId, 'library card ID');
        const card = await LibraryCard.findById(cardId).populate({
            path: 'borrowList',
            populate: { path: 'book' }
        });
        if (!card) throw createError('No Library Card with ID : ' + cardId, 404);
        return card.borrowList;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.addToCard = async (cardId, data) => {
    try {
        validateId(cardId, 'library card ID');
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            throw createError('Request body must be a JSON object', 400);
        }
        if (!mongoose.isValidObjectId(data.bookId)) {
            throw createError('Invalid book ID', 400);
        }

        const card = await LibraryCard.findById(cardId);
        if (!card) throw createError('No Library Card with ID : ' + cardId, 404);

        const book = await Book.findById(data.bookId);
        if (!book) throw createError('No Book with ID : ' + data.bookId, 404);
        
        if (book.isBorrowed) {
            throw createError('Book already has an active borrow record', 409);
        }

        book.isBorrowed = true;
        book.hasBorrowHistory = true;
        await book.save();

        let record = await BorrowRecord.create({ book: book._id });
        await LibraryCard.updateOne(
            { _id: card._id },
            { $addToSet: { borrowList: record._id }}
        );
    
        return await record.populate('book');
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.getOne = async (recordId) => {
    try {
        validateId(recordId, 'borrow record ID');
        const record = await BorrowRecord.findById(recordId).populate('book');
        if (!record) throw createError('No Borrow Record with ID : ' + recordId, 404);
        return record;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.returnOne = async (recordId) => {
    try {
        validateId(recordId, 'borrow record ID');
        const existingRecord = await BorrowRecord.exists({ _id: recordId });
        if (!existingRecord) throw createError('No Borrow Record with ID : ' + recordId, 404);

        const record = await BorrowRecord.findOneAndUpdate(
            {
                _id: recordId,
                $or: [
                    { returnDate: null },
                    { returnDate: { $exists: false } }
                ]
            },
            { $set: { returnDate: new Date() } },
            { returnDocument: 'after', runValidators: true }
        )

        if (!record) throw createError('Borrow record has already been returned', 409);
        await Book.findByIdAndUpdate(record.book, { isBorrowed: false }, { runValidators: true }).exec();
        return await record.populate('book');
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

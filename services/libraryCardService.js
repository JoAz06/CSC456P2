const mongoose = require('mongoose');
const LibraryCard = require('../models/LibraryCard');
require('../models/BorrowRecord');
const User = require('../models/User');
const Logger = require('../logger');

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function validateCardId(cardId) {
    if (!mongoose.isValidObjectId(cardId)) {
        throw createError('Invalid library card ID', 400);
    }
}

function getCardFields(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw createError('Request body must be a JSON object', 400);
    }

    const fields = {};
    if (data.cardNumber !== undefined) fields.cardNumber = data.cardNumber;
    if (data.issueDate !== undefined) fields.issueDate = data.issueDate;
    if (data.expiryDate !== undefined) fields.expiryDate = data.expiryDate;
    return fields;
}

exports.getAll = async () => {
    try {
        return await LibraryCard.find().populate('borrowList');
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.getOne = async (cardId) => {
    try {
        validateCardId(cardId);
        const card = await LibraryCard.findById(cardId).populate('borrowList');
        if (!card) throw createError('No Library Card with ID : ' + cardId, 404);
        return card;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.addOne = async (data) => {
    try {
        const fields = getCardFields(data);
        return await LibraryCard.create(fields);
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.updateOne = async (cardId, data) => {
    try {
        validateCardId(cardId);
        if (data && data.borrowList !== undefined) {
            throw createError('borrowList cannot be changed through this operation', 400);
        }

        const fields = getCardFields(data);
        if (Object.keys(fields).length === 0) {
            throw createError('No library card fields provided to update', 400);
        }

        const card = await LibraryCard.findByIdAndUpdate(
            cardId,
            { $set: fields },
            { returnDocument: 'after', runValidators: true }
        ).populate('borrowList');
        if (!card) throw createError('No Library Card with ID : ' + cardId, 404);
        return card;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.deleteOne = async (cardId) => {
    try {
        validateCardId(cardId);
        const card = await LibraryCard.findById(cardId);
        if (!card) throw createError('No Library Card with ID : ' + cardId, 404);

        const assignedUser = await User.exists({ libraryCard: card._id });
        if (assignedUser) {
            throw createError('Cannot delete a library card assigned to a user', 409);
        }
        if (card.borrowList.length > 0) {
            throw createError('Cannot delete a library card with borrowing history', 409);
        }

        await card.deleteOne();
        return card;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

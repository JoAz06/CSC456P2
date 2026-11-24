const mongoose = require('mongoose');
const User = require('../models/User');
const LibraryCard = require('../models/LibraryCard');
const Logger = require('../logger');

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function validateUserId(userId) {
    if (!mongoose.isValidObjectId(userId)) {
        throw createError('Invalid user ID', 400);
    }
}

function getUserFields(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw createError('Request body must be a JSON object', 400);
    }

    const fields = {};
    if (data.name !== undefined) fields.name = data.name;
    if (data.email !== undefined) fields.email = data.email;
    return fields;
}

exports.getAll = async () => {
    try {
        return await User.find().populate('libraryCard');
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.getOne = async (userId) => {
    try {
        validateUserId(userId);
        const user = await User.findById(userId).populate('libraryCard');
        if (!user) throw createError('No User with ID : ' + userId, 404);
        return user;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.addOne = async (data) => {
    try {
        const fields = getUserFields(data);
        if (!data.libraryCard) {
            throw createError('libraryCard is required', 400);
        }
        if (!mongoose.isValidObjectId(data.libraryCard)) {
            throw createError('Invalid library card ID', 400);
        }

        const libraryCard = await LibraryCard.findById(data.libraryCard);
        if (!libraryCard) throw createError('No Library Card with ID : ' + data.libraryCard, 404);

        const existingUser = await User.exists({ libraryCard: libraryCard._id });
        if (existingUser) throw createError('Library card is already assigned to a user', 409);

        const user = await User.create({
            ...fields,
            libraryCard: libraryCard._id
        });
        return user.populate('libraryCard');
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.updateOne = async (userId, data) => {
    try {
        validateUserId(userId);
        const fields = getUserFields(data);
        if (data.libraryCard !== undefined) {
            throw createError('libraryCard cannot be changed through this operation', 400);
        }
        if (Object.keys(fields).length === 0) {
            throw createError('No user fields provided to update', 400);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: fields },
            { returnDocument: 'after', runValidators: true }
        ).populate('libraryCard');
        if (!user) throw createError('No User with ID : ' + userId, 404);
        return user;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

exports.deleteOne = async (userId) => {
    try {
        validateUserId(userId);
        const user = await User.findByIdAndDelete(userId);
        if (!user) throw createError('No User with ID : ' + userId, 404);
        return user;
    } catch (err) {
        Logger.log('SERVICE', 'Error : ' + err.message);
        throw err;
    }
};

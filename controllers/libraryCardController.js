const libraryCardService = require('../services/libraryCardService');
const Logger = require('../logger');

function sendError(res, err) {
    Logger.log('CONTROLLER', 'Error : ' + err.message);
    const statusCode = err.statusCode || (err.code === 11000 ? 409 : 400); // 11000 = duplicate in database, 409 = conflict, 400 = bad request
    res.status(statusCode).json({ error: err.message });
}

exports.getAll = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get all library cards');
        const cards = await libraryCardService.getAll();
        res.status(200).json(cards);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get library card with ID : ' + req.params.cardId);
        const card = await libraryCardService.getOne(req.params.cardId);
        res.status(200).json(card);
    } catch (err) {
        sendError(res, err);
    }
};

exports.addOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add new library card');
        const card = await libraryCardService.addOne(req.body);
        res.status(201).json(card);
    } catch (err) {
        sendError(res, err);
    }
};

exports.updateOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Update library card with ID : ' + req.params.cardId);
        const card = await libraryCardService.updateOne(req.params.cardId, req.body);
        res.status(200).json(card);
    } catch (err) {
        sendError(res, err);
    }
};

exports.deleteOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Delete library card with ID : ' + req.params.cardId);
        await libraryCardService.deleteOne(req.params.cardId);
        res.status(204).send();
    } catch (err) {
        sendError(res, err);
    }
};

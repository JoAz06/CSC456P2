const borrowRecordService = require('../services/borrowRecordService');
const Logger = require('../logger');

function sendError(res, err) {
    Logger.log('CONTROLLER', 'Error : ' + err.message);
    const statusCode = err.statusCode || (err.code === 11000 ? 409 : 400); // 11000 = duplicate in database, 409 = conflict, 400 = bad request
    res.status(statusCode).json({ error: err.message });
}

exports.getForCard = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get borrow records for library card : ' + req.params.cardId);
        const records = await borrowRecordService.getForCard(req.params.cardId);
        res.status(200).json(records);
    } catch (err) {
        sendError(res, err);
    }
};

exports.addToCard = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add borrow record to library card : ' + req.params.cardId);
        const record = await borrowRecordService.addToCard(req.params.cardId, req.body);
        res.status(201).json(record);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get borrow record with ID : ' + req.params.recordId);
        const record = await borrowRecordService.getOne(req.params.recordId);
        res.status(200).json(record);
    } catch (err) {
        sendError(res, err);
    }
};

exports.returnOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Return borrow record with ID : ' + req.params.recordId);
        const record = await borrowRecordService.returnOne(req.params.recordId);
        res.status(200).json(record);
    } catch (err) {
        sendError(res, err);
    }
};

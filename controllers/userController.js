const userService = require('../services/userService');
const Logger = require('../logger');

function sendError(res, err) {
    Logger.log('CONTROLLER', 'Error : ' + err.message);
    const statusCode = err.statusCode || (err.code === 11000 ? 409 : 400); // 11000 = duplicate in database, 409 = conflict, 400 = bad request
    res.status(statusCode).json({ error: err.message });
}

exports.getAll = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get all users');
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get user with ID : ' + req.params.userId);
        const user = await userService.getOne(req.params.userId);
        res.status(200).json(user);
    } catch (err) {
        sendError(res, err);
    }
};

exports.addOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add new user');
        const user = await userService.addOne(req.body);
        res.status(201).json(user);
    } catch (err) {
        sendError(res, err);
    }
};

exports.updateOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Update user with ID : ' + req.params.userId);
        const user = await userService.updateOne(req.params.userId, req.body);
        res.status(200).json(user);
    } catch (err) {
        sendError(res, err);
    }
};

exports.deleteOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Delete user with ID : ' + req.params.userId);
        await userService.deleteOne(req.params.userId);
        res.status(204).send();
    } catch (err) {
        sendError(res, err);
    }
};

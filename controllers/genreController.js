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
        Logger.log('CONTROLLER', 'Get all genres');
        const genres = await genreService.getAll();
        // res.status(200).json(genres);
        res.render("genre/all", { title: "Users Page", genres});
    } catch (err) {
        sendError(res, err);
    }
};

exports.getOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Get genre with name : '+req.params.name);
        const genre = await genreService.getOne(escapeWord(req.params.name));
        res.status(200).json(genre);
    } catch (err) {
        sendError(res, err);
    }
};

exports.addOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Add new genre with data : '+JSON.stringify(req.body));
        const genre = await genreService.addOne(req.body);
        // res.status(201).json(genre);
        res.redirect("/genre");
    } catch (err) {
        sendError(res, err);
    }
};

exports.updateOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Update genre with name : '+req.params.name+' and data : '+JSON.stringify(req.body));
        const genre = await genreService.updateOne(escapeWord(req.params.name), req.body);
        res.status(200).json(genre);
    } catch (err) {
        sendError(res, err);
    }
};

exports.deleteOne = async (req, res) => {
    try {
        Logger.log('CONTROLLER', 'Delete genre with name : '+req.params.name);
        await genreService.deleteOne(escapeWord(req.params.name));
        // res.status(204).send();
        res.redirect("/genre");
    } catch (err) {
        sendError(res, err);
    }
};
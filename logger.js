const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'logs.db',
    logging: false
});

const Log = sequelize.define('Log', {
    type: DataTypes.STRING,
    description: DataTypes.STRING,
});

const ready = sequelize.sync();

exports.log = async (type, description) => {
    try {
        await Log.create({
            type,
            description
        });
    } catch (err) {
        console.error('Logging failed:', err.message);
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({limit: 10, order: [['createdAt', 'DESC']], attributes : {exclude: ['updatedAt','id']}});
        res.status(200).json(logs);
    } catch (err) {
        console.error('Fetching logs failed:', err.message);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

exports.sequelize = sequelize;

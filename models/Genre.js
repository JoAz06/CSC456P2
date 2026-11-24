const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true, immutable: true },
    description: String,
    books : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

module.exports = mongoose.model('Genre', genreSchema);
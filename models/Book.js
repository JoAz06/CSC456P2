const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    isbn: { type: String, unique: true, required: true, immutable: true },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    isBorrowed: { type: Boolean, default: false},
    hasBorrowHistory: { type: Boolean, default: false}
});

module.exports = mongoose.model('Book', bookSchema);
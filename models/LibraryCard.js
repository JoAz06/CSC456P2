const mongoose = require('mongoose');

const libraryCardSchema = new mongoose.Schema({
    cardNumber: { type: Number, unique: true, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    borrowList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRecord' }]
});

module.exports = mongoose.model('LibraryCard', libraryCardSchema);

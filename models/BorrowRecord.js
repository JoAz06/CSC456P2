const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, required: true, default: Date.now },
    returnDate: Date
});

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);

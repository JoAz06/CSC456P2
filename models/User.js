const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    libraryCard: { type: mongoose.Schema.Types.ObjectId, ref: 'LibraryCard', unique: true, required: true }
});

module.exports = mongoose.model('User', userSchema);

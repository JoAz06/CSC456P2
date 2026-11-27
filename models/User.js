const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    libraryCard: { type: mongoose.Schema.Types.ObjectId, ref: 'LibraryCard', unique: true, required: true },
    role: { type: String, enum: ['member', 'admin'], default: 'member' },
    password: { type: String, required: true, select: false}
});

module.exports = mongoose.model('User', userSchema);

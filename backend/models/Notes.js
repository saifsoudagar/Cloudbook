const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Refers to the 'user' collection
    },
    title: {
        type: String,
        required: true, // 'require' should be 'required'
    },
    description: {
        type: String,
        required: true, // 'require' should be 'required'
    },
    tag: {
        type: String,
        default: "general",
    },
    Date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('notes', NotesSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true, // 'require' should be 'required'
    },
    email: {
        type: String,
        required: true, // 'require' should be 'required'
        unique: true,
    },
    password: {
        type: String,
        required: true, // 'require' should be 'required'
    },
    Date: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
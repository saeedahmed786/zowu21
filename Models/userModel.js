const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: '0'
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: Object
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;

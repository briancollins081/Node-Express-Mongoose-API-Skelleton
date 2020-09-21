const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    profilepicture: {
        type: String,
        default: '/images/default/profile.jpg'
    },
}, {timestamps: true});


module.exports = mongoose.model('User', userSchema);
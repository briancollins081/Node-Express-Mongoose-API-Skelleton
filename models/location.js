const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
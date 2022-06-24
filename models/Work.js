const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
    name: {
        type: String
    },

    phone: {
        type: String,
    },
    
    note: {
        type: String,
    },

    location: {
        type: String,
    },

    brand_location: {
        type: String,
    },

    email: {
        type: String,
    },

    Date: {
        type: String
    }
})

const Work = mongoose.model('Work', workSchema, 'Work')
module.exports = Work
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 200,
        required: true,
    },

    email: {
        type: String,
        max: 200,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },
    
    location: {
        type: String,
    },

    area: {
        type: String,
    },

    phone: {
        type: String,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    cart: {
        type: Array,
        default: [],
    },

    commented:{
        type: Array,
        default: []
    },

    Date: {
        type: String,
        default: Date.now()
    }
})

const User = mongoose.model('User', userSchema, 'User');
module.exports = User;
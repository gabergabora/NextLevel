const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    userID: {
        type: String,
    },

    name: {
        type: String,
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

    order: {
        type: Array,
        default: [],
    },

    isAccept: {
        type: Boolean,
        default: false,
    },

    isReject: {
        type: Boolean,
        default: false,
    },

    isComming: {
        type: Boolean,
        default: false,
    },

    isDone: {
        type: Boolean,
        default: false,
    },

    isChampion: {
        type: Boolean,
        default: false,
    },

    Date: {
        type: String,
    }
})

const Orders = mongoose.model('Orders', ordersSchema, 'Orders')
module.exports = Orders
const mongoose = require('mongoose');

const championSchema = new mongoose.Schema({
    title: {
        type: String
    },

    des: {
        type: String
    },
    
    price: {
        type: Number
    },

    players: {
        type: Array,
        default: []
    },

    limit: {
        type: Number
    },

    image: {
        type: String
    },

    isStock: {
        type: Boolean,
        default: false,
    },

    start_date: {
        type: String,
    },

    stages: {
        type: Array,
        default:[]
    },

    rounds: {
        type: Array,
        default:[]
    },

    start: {
        type: Boolean,
        default:false,
    },

    finshed: {
        type: Boolean,
        default:false,
    },

    winner: {
        type: String,
    },

    winnerID: {
        type: String,
    },

    Date: {
        type: String,
    },
})

const Champion = mongoose.model('Champion', championSchema, 'Champion')
module.exports = Champion
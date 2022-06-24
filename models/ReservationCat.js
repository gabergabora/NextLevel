const mongoose = require('mongoose');

const reservationCatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    Date: {
        type: Date,
        default: Date.now()
    }
})

const ReservationCat = mongoose.model('ReservationCat', reservationCatSchema, 'ReservationCat')
module.exports = ReservationCat
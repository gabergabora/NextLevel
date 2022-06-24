const mongoose = require('mongoose')
const router = require('../routes/api')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    des: {
        type: String,
        required: true,
    },

    minDes: {
        type: String,
        required: true,
    },

    inStock: {
        type: Boolean,
        default: true,
    },

    score: {
        type: Number,
        default: 0,
    },

    price: {
        type: String,
        required: true,
    },

    category:{
        type: String,
        required: true,
    },

    Date: {
        type: Date,
        default: Date.now(),
    },

    image: {
        type: String,
    },

})

const Product = mongoose.model('Products', productSchema, 'Products')
module.exports = Product
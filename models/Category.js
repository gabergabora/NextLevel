const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    Date: {
        type: Date,
        default: Date.now()
    }
})

const Category = mongoose.model('Category', categorySchema, 'Category')
module.exports = Category
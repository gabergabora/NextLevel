const mongoose = require('mongoose');

const newPostSchema = new mongoose.Schema({
    title: {
        type: String,
        max: 1000,
    },

    des: {
        type: String,
        max: 15000,
    },

    image:{
        type: String,
        default: "none",
    },

    comments:{
        type: Array,
        default: []
    },

    authorName:{
        type: String,
    },

    authorID: {
        type: String,
    },

    Date: {
        type: String
    },

    isAccept: {
        type: Boolean,
        default: false
    },
})

const Post = mongoose.model('Post', newPostSchema, 'Post')
module.exports = Post
const mongoose = require('mongoose');
const commentSchema = require('./comment').schema;

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },    
    caption: {
        type: String,
        required: true
    },
    like: {
        type: Number,
    },
    comments: [commentSchema]
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
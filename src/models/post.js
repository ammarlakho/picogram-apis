const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    reqquired: true,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

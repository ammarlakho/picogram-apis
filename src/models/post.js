const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  poster: {
    type: String,
    ref: 'User',
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  like: Number,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

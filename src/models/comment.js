const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commenter: {
    type: String,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    reqquired: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

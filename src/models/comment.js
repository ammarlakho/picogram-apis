const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

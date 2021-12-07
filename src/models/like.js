const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  liker: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;

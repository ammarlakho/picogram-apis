const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  liker: {
    type: String,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  // comment: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Comment',
  // },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;

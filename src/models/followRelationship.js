const mongoose = require('mongoose');

const followRelationshipSchema = new mongoose.Schema({
  // if A follows B, A is sender, B is receiver
  sender: {
    type: String,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: String,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'none'],
    default: 'pending',
  },
});

const FollowRelationship = mongoose.model(
  'FollowRelationship',
  followRelationshipSchema
);
module.exports = FollowRelationship;

const mongoose = require('mongoose');

const followRelationshipSchema = new mongoose.Schema({
  sender: {
    type: String,
    ref: 'User',
  },
  receiver: {
    type: String,
    ref: 'User',
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

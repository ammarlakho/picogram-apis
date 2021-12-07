const mongoose = require('mongoose');

const followRelationshipSchema = new mongoose.Schema({
  sender: {
    type: String,
  },
  receiver: {
    type: String,
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

const mongoose = require('mongoose');

const followRelationshipSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

const FollowRelationship = mongoose.model('Request', followRelationshipSchema);
module.exports = FollowRelationship;

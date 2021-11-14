const mongoose = require('mongoose');
const postSchema = require('./post').schema;

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  pictures: [postSchema],
  followers: [String],
  following: [String],
  requests: [String],
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;

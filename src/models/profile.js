const mongoose = require('mongoose');
const postSchema = require('./post').schema;

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
    default: '',
  },
  pictures: [postSchema],
  followers: [String],
  following: [String],
  requests: [String],
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;

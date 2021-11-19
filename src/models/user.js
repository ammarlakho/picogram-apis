const mongoose = require('mongoose');
const profileSchema = require('./profile').schema;

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    requried: true,
  },
  password: {
    type: String,
    required: true,
  },
  privacy: {
    type: Boolean,
    required: true,
  },
  profile: {
    type: profileSchema,
    default: {},
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

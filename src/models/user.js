const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  fullname: {
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
  bio: {
    type: String,
    default: '',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

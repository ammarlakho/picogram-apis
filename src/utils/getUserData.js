const User = require('../models/user');

const getPublicUser = (userOther) => {
  return {
    fullname: userOther.fullname,
    username: userOther.username,
    bio: userOther.profile.bio,
    followersCount: userOther.profile.followers.length,
    followingCount: userOther.profile.following.length,
    followStatus: -1,
  };
};

const getPrivateUser = (userOther) => {
  return {
    fullname: userOther.fullname,
    username: userOther.username,
    bio: userOther.profile.bio,
    followers: userOther.profile.followers,
    following: userOther.profile.following,
    pictures: userOther.pictures,
    followStatus: 1,
  };
};

const getNewUser = (body) => {
  const newUser = new User({
    fullname: body.fullname,
    username: body.username,
    email: body.email,
    password: body.password,
    privacy: body.privacy,
  });
  return newUser;
};

const getMyUser = (userOther) => {
  return {
    fullname: userOther.fullname,
    username: userOther.username,
    bio: userOther.profile.bio,
    followers: userOther.profile.followers,
    following: userOther.profile.following,
    pictures: userOther.pictures,
    email: userOther.email,
    followStatus: 0,
  };
};

module.exports = {
  getPublicUser,
  getPrivateUser,
  getNewUser,
  getMyUser,
};

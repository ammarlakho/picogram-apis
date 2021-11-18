const User = require('../models/user');

const getPublicUser = (userOther) => {
  return {
    firstname: userOther.firstname,
    lastname: userOther.lastname,
    username: userOther.username,
    bio: userOther.profile.bio,
    followersCount: userOther.profile.followers.length,
    followingCount: userOther.profile.following.length,
  };
};

const getPrivateUser = (userOther) => {
  return {
    firstname: userOther.firstname,
    lastname: userOther.lastname,
    username: userOther.username,
    bio: userOther.profile.bio,
    followers: userOther.profile.followers,
    following: userOther.profile.following,
    pictures: userOther.pictures,
  };
};

const getNewUser = (body) => {
  const newUser = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    username: body.username,
    email: body.email,
    password: body.password,
    privacy: body.privacy,
    profile: {
      bio: body.bio,
    },
  });
  return newUser;
};

const getMyUser = (userOther) => {
  return {
    firstname: userOther.firstname,
    lastname: userOther.lastname,
    username: userOther.username,
    bio: userOther.profile.bio,
    followers: userOther.profile.followers,
    following: userOther.profile.following,
    pictures: userOther.pictures,
    email: userOther.email,
  };
};

module.exports = {
  getPublicUser,
  getPrivateUser,
  getNewUser,
  getMyUser,
};

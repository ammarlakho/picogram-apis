/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const FollowRelationship = require('../models/followRelationship');
const Post = require('../models/post');

const getUserObject = (
  otherUser,
  followersCount,
  followingCount,
  posts,
  status
) => {
  return {
    fullname: otherUser.fullname,
    username: otherUser.username,
    bio: otherUser.profile.bio,
    privacy: otherUser.privacy,
    followersCount,
    followingCount,
    posts,
    followStatus: status,
  };
};

const getUser = async (myUsername, otherUsername) => {
  const otherUser = await User.findOne({ username: otherUsername }).exec();

  const relationship = await FollowRelationship.findOne({
    sender: myUsername,
    receiver: otherUsername,
  }).exec();

  const followingCount = await FollowRelationship.countDocuments({
    sender: otherUsername,
  }).exec();

  const followersCount = await FollowRelationship.countDocuments({
    receiver: otherUsername,
  }).exec();

  // If i want to see my own profile
  if (myUsername === otherUsername) {
    const posts = await Post.find({ poster: otherUser._id }).exec();
    return getUserObject(otherUser, followersCount, followingCount, posts, 0);
  }

  // If i am following the other user
  if (relationship.status === 'accepted') {
    const posts = await Post.find({ poster: otherUser._id }).exec();
    return getUserObject(otherUser, followersCount, followingCount, posts, 1);
  }

  // If i am not following the other user and they are private
  if (otherUser.privacy) {
    return getUserObject(otherUser, followersCount, followingCount, [], -1);
  }

  // If i am not following the other user and they are public
  const posts = await Post.find({ poster: otherUser._id }).exec();
  return getUserObject(otherUser, followersCount, followingCount, posts, -1);
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

module.exports = {
  getNewUser,
  getUser,
};

// const getMyUser = (userOther) => {
//   return {
//     fullname: userOther.fullname,
//     username: userOther.username,
//     bio: userOther.profile.bio,
//     followers: userOther.profile.followers,
//     following: userOther.profile.following,
//     pictures: userOther.pictures,
//     email: userOther.email,
//     followStatus: 0,
//   };
// };

// const getPublicUser = (userOther) => {
//   return {
//     fullname: userOther.fullname,
//     username: userOther.username,
//     bio: userOther.profile.bio,
//     privacy: userOther.privacy,
//     followersCount: userOther.profile.followers.length,
//     followingCount: userOther.profile.following.length,
//     followStatus: -1,
//   };
// };

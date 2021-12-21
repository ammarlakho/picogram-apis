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
  console.log('fullname', otherUser.fullname);
  console.log('username', otherUser._id);
  console.log('status', status);
  return {
    fullname: otherUser.fullname,
    username: otherUser._id,
    bio: otherUser.bio,
    privacy: otherUser.privacy,
    followersCount,
    followingCount,
    posts,
    followStatus: status,
  };
};

const getUser = async (myUsername, otherUsername) => {
  const otherUser = await User.findById(otherUsername).exec();
  console.log('otherUser', otherUser);
  const relationship = await FollowRelationship.findOne({
    sender: myUsername,
    receiver: otherUsername,
  }).exec();

  const followingCount = await FollowRelationship.countDocuments({
    sender: otherUsername,
    status: 'accepted',
  }).exec();
  console.log('followingCount', followingCount);
  const followersCount = await FollowRelationship.countDocuments({
    receiver: otherUsername,
    status: 'accepted',
  }).exec();

  console.log('followersCount', followersCount);

  // If i want to see my own profile
  if (myUsername === otherUsername) {
    const posts = await Post.find({ poster: otherUser._id }).exec();
    console.log('posts', posts);
    return getUserObject(otherUser, followersCount, followingCount, posts, 0);
  }

  // If i am following the other user
  if (relationship && relationship.status === 'accepted') {
    const posts = await Post.find({ poster: otherUser._id }).exec();
    return getUserObject(otherUser, followersCount, followingCount, posts, 1);
  }

  // if i am not following the other user, they are private and i have a pending follow request
  if (relationship && relationship.status === 'pending') {
    return getUserObject(otherUser, followersCount, followingCount, [], -2);
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
    _id: body.username,
    fullname: body.fullname,
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

/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
// const config = require('../../config');
/* eslint-disable consistent-return */
// const { editUserArray } = require('../utils/editUser');

let header = {
  error_code: String,
  message: String,
};
const User = require('../models/user');

exports.getFollowers = (req, res) => {
  const myUsername = req.decoded.username;

  User.findOne({ username: myUsername }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }
    header = { error_code: 200, message: 'Got followers' };
    const followers = user.profile.followers;
    return res.status(header.error_code).send({ header, followers });
  });
};

exports.getFollowing = (req, res) => {
  const myUsername = req.decoded.username;

  User.findOne({ username: myUsername }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }
    header = { error_code: 200, message: 'Got following' };
    const following = user.profile.following;
    return res.status(header.error_code).send({ header, following });
  });
};

exports.unfollow = (req, res) => {
  const myUsername = req.decoded.username;
  const unfollowUsername = req.query.username;

  // Unfollow req sender wala user
  User.findOne({ username: myUsername }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }

    if (!user) {
      header = { error_code: 404, message: 'User not found' };
      return res.status(header.error_code).send({ header });
    }

    const index = user.profile.following.indexOf(unfollowUsername);

    if (index === -1) {
      header = {
        error_code: 400,
        message: 'Not found in following list',
      };
      return res.status(header.error_code).send({ header });
    }

    user.profile.following.splice(index, 1);
    user.save((saveErr) => {
      if (saveErr) {
        header = { error_code: 500, message: saveErr };
        return res.status(header.error_code).send({ header });
      }
    });

    // Unfollow req reciever wala user
    User.findOne({ username: unfollowUsername }, (err2, otherUser) => {
      if (err2) {
        header = { error_code: 500, message: err2 };
        return res.status(header.error_code).send({ header });
      }

      if (!otherUser) {
        header = { error_code: 404, message: 'User not found' };
        return res.status(header.error_code).send({ header });
      }

      const index2 = otherUser.profile.followers.indexOf(myUsername);

      if (index2 === -1) {
        header = {
          error_code: 400,
          message: 'Not found in follower list',
        };
        return res.status(header.error_code).send({ header });
      }

      otherUser.profile.followers.splice(index2, 1);
      otherUser.save((saveErr) => {
        if (saveErr) {
          header = { error_code: 500, message: saveErr };
          return res.status(header.error_code).send({ header });
        }
      });
      header = { error_code: 200, message: 'Succesfully unfollowed' };
      return res.status(header.error_code).send({ header, user, otherUser });
    });
  });
};

// Remove from following of other person
exports.removeFollower = (req, res) => {
  const myUsername = req.decoded.username;
  const removeUsername = req.query.username;

  // Remove from follower list of req sender
  User.findOne({ username: myUsername }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }

    if (!user) {
      header = { error_code: 404, message: 'User not found' };
      return res.status(header.error_code).send({ header });
    }

    const index = user.profile.followers.indexOf(removeUsername);

    if (index === -1) {
      header = {
        error_code: 400,
        message: 'Not found in following list',
      };
      return res.status(header.error_code).send({ header });
    }

    user.profile.followers.splice(index, 1);
    user.save((saveErr) => {
      if (saveErr) {
        header = { error_code: 500, message: saveErr };
        return res.status(header.error_code).send({ header });
      }
    });

    // Remove from following list of req reciever
    User.findOne({ username: removeUsername }, (err2, otherUser) => {
      if (err2) {
        header = { error_code: 500, message: err2 };
        return res.status(header.error_code).send({ header });
      }

      if (!otherUser) {
        header = { error_code: 404, message: 'User not found' };
        return res.status(header.error_code).send({ header });
      }

      const index2 = otherUser.profile.following.indexOf(myUsername);

      if (index2 === -1) {
        header = {
          error_code: 400,
          message: 'Not found in follower list',
        };
        return res.status(header.error_code).send({ header });
      }

      otherUser.profile.following.splice(index2, 1);
      otherUser.save((saveErr) => {
        if (saveErr) {
          header = { error_code: 500, message: saveErr };
          return res.status(header.error_code).send({ header });
        }
      });
      header = { error_code: 200, message: 'Succesfully removed follower' };
      return res.status(header.error_code).send({ header, user, otherUser });
    });
  });
};

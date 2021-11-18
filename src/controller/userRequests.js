/* eslint-disable consistent-return */
let header = {
  error_code: String,
  message: String,
};
const User = require('../models/user');

exports.acceptRequest = (req, res) => {
  const myUsername = req.decoded.username;
  const followerUsername = req.query.username;

  User.findOne({ username: myUsername }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }

    if (!user) {
      header = { error_code: 404, message: 'User not found' };
      return res.status(header.error_code).send({ header });
    }

    const index = user.profile.requests.indexOf(followerUsername);

    if (index === -1) {
      header = {
        error_code: 400,
        message: `You do not have a request from '${followerUsername}''`,
      };
      return res.status(header.error_code).send({ header });
    }

    // Removed from requests
    user.profile.requests.splice(index, 1);
    // Add to followers
    user.profile.followers.push(followerUsername);
    user.save((saveErr) => {
      if (saveErr) {
        header = { error_code: 500, message: saveErr };
        return res.status(header.error_code).send({ header });
      }
    });

    User.findOne({ username: followerUsername }, (err2, otherUser) => {
      if (err2) {
        header = { error_code: 500, message: err2 };
        return res.status(header.error_code).send({ header });
      }
      // Add to following
      otherUser.profile.following.push(myUsername);
      otherUser.save((saveErr) => {
        if (saveErr) {
          header = { error_code: 500, message: saveErr };
          return res.status(header.error_code).send({ header });
        }
      });
      header = {
        error_code: 200,
        message: `Accepted follow req from: ${followerUsername}`,
      };
      return res.status(header.error_code).send({ header, user, otherUser });
    });
  });
};

exports.rejectRequest = (req, res) => {
  const myUsername = req.decoded.username;
  const followerUsername = req.query.username;

  User.findOne({ username: myUsername }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }

    if (!user) {
      header = { error_code: 404, message: 'User not found' };
      return res.status(header.error_code).send({ header });
    }

    const index = user.profile.requests.indexOf(followerUsername);

    if (index === -1) {
      header = {
        error_code: 400,
        message: `You do not have a request from '${followerUsername}''`,
      };
      return res.status(header.error_code).send({ header });
    }

    // Removed from requests
    user.profile.requests.splice(index, 1);
    user.save((saveErr) => {
      if (saveErr) {
        header = { error_code: 500, message: saveErr };
        return res.status(header.error_code).send({ header });
      }
    });

    header = {
      error_code: 200,
      message: `Rejected follow req from: ${followerUsername}`,
    };
    return res.status(header.error_code).send({ header, user });
  });
};

exports.sendRequest = (req, res) => {
  const myUsername = req.decoded.username;
  const requestedUsername = req.query.username;

  User.findOne({ username: requestedUsername }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }

    if (!user) {
      header = { error_code: 404, message: 'User not found' };
      return res.status(header.error_code).send({ header });
    }

    const index = user.profile.requests.indexOf(myUsername);
    const index2 = user.profile.followers.indexOf(myUsername);

    if (index !== -1) {
      header = {
        error_code: 400,
        message: `You '${myUsername}' have already sent a request to '${requestedUsername}''`,
      };
      return res.status(header.error_code).send({ header });
    }

    if (index2 !== -1) {
      header = {
        error_code: 400,
        message: `You '${myUsername}' are already following '${requestedUsername}''`,
      };
      return res.status(header.error_code).send({ header });
    }

    // Add to requests
    user.profile.requests.push(myUsername);
    user.save((saveErr) => {
      if (saveErr) {
        header = { error_code: 500, message: saveErr };
        return res.status(header.error_code).send({ header });
      }
    });

    header = {
      error_code: 200,
      message: `Sent follow req to: ${requestedUsername}`,
    };
    return res.status(header.error_code).send({ header, user });
  });
};

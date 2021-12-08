/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { getUser, getNewUser } = require('../utils/getUserData');

let header = {
  status_code: String,
  message: String,
};
const User = require('../models/user');
const FollowRelationship = require('../models/followRelationship');

exports.getProfile = async (req, res) => {
  let otherUsername;
  console.log('params', req.params.username);
  if (req.params.username === undefined) {
    otherUsername = req.decoded.username;
  } else {
    otherUsername = req.params.username;
  }
  const myUsername = req.decoded.username;

  if (!otherUsername) {
    header = { status_code: 400, message: 'Username not provided' };
    return res.status(header.status_code).send({ header });
  }

  console.log('myUsername', myUsername);
  console.log('otherUsername', otherUsername);

  try {
    header = { status_code: 200, message: `Got ${otherUsername}'s profile` };
    const userObj = await getUser(myUsername, otherUsername);
    console.log('userObj', userObj);
    return res.status(header.status_code).send({ header, userObj });
  } catch (err) {
    header = { status_code: 500, message: `Error getting user ${err}` };
    return res.status(header.status_code).send({ header });
  }
};

exports.editMyProfile = (req, res) => {
  User.findOne({ _id: req.decoded.username }, (findErr, user) => {
    if (findErr) {
      header = { status_code: 500, message: findErr };
      return res.status(header.status_code).send({ header });
    }

    if (!user) {
      header = { status_code: 404, message: 'User not found' };
      return res.status(header.status_code).send({ header });
    }

    if (req.body.fullname) user.fullname = req.body.username;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.privacy) user.privacy = req.body.privacy;

    user.save((saveErr, savedUser) => {
      if (saveErr) {
        header = { status_code: 500, message: saveErr };
        return res.status(header.status_code).send({ header });
      }

      header = { status_code: 200, message: 'User updated successfully' };
      return res.status(header.status_code).send({ header, savedUser });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ _id: username }, (err, user) => {
    if (err) {
      header = { status_code: 500, message: 'Internal server error' };
      return res.status(header.status_code).send({ header });
    }

    if (user) {
      if (password !== user.password) {
        header = { status_code: 401, message: 'Incorrect password' };
        return res.status(header.status_code).send({ header });
      }
      header = { status_code: 200, message: 'Login successful' };
      const userSignObj = { username };
      const accessToken = jwt.sign(userSignObj, config.SECRET_KEY, {
        expiresIn: '10h',
      });
      return res.status(header.status_code).send({ header, accessToken });
    }

    header = { status_code: 404, message: 'User not found' };
    return res.status(header.status_code).send({ header });
  });
};

exports.register = (req, res) => {
  console.log('body', req.body);
  const { email, username } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      header = { status_code: 500, message: err };
      return res.status(header.status_code).send({ header });
    }

    if (user) {
      header = { status_code: 403, message: 'Email already exists' };
      return res.status(header.status_code).send({ header });
    }
    // eslint-disable-next-line no-unused-vars
    User.findOne({ _id: username }, (findUsernameErr, userFound) => {
      if (findUsernameErr) {
        header = { status_code: 500, message: findUsernameErr };
        return res.status(header.status_code).send({ header });
      }

      if (userFound) {
        header = { status_code: 403, message: 'Username already exists' };
        return res.status(header.status_code).send({ header });
      }

      const newUser = getNewUser(req.body);
      console.log('newUser', newUser);
      newUser.save((saveErr) => {
        if (saveErr) {
          header = { status_code: 400, message: saveErr };
          return res.status(header.status_code).send({ header });
        }

        header = {
          status_code: 200,
          message: 'User created successfully',
        };
        const userSignObj = { username };
        const accessToken = jwt.sign(userSignObj, config.SECRET_KEY, {
          expiresIn: '10h',
        });
        return res
          .status(header.status_code)
          .send({ header, newUser, accessToken });
      });
    });
  });
};

/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const config = require('../../config');
const {
  getPrivateUser,
  getPublicUser,
  getNewUser,
  getMyUser,
} = require('../utils/getUserData');

let header = {
  error_code: String,
  message: String,
};
const User = require('../models/user');

exports.getProfile = (req, res) => {
  const otherUsername = req.params.username;
  const myUsername = req.decoded.username;

  if (!otherUsername) {
    header = { error_code: 400, message: 'Username not provided' };
    return res.status(header.error_code).send({ header });
  }

  User.findOne({ username: myUsername }, (findErr, user) => {
    if (findErr) {
      header = { error_code: 500, message: findErr };
      return res.status(header.error_code).send({ header });
    }

    if (!user) {
      header = { error_code: 404, message: 'User not found' };
      return res.status(header.error_code).send({ header });
    }

    // If other user is me
    if (myUsername === otherUsername) {
      const userMyInfo = getMyUser(user);
      header = { error_code: 200, message: 'Successfully found user(ME)' };
      return res.status(header.error_code).send({ header, userMyInfo });
    }

    const tempFollowing = user.profile.following;
    const found = tempFollowing.find(
      (tempUsername) => otherUsername === tempUsername
    );

    // If other user is not me and I follow the other user
    if (found) {
      User.findOne({ username: otherUsername }, (find2Err, userOther) => {
        if (find2Err) {
          header = { error_code: 500, message: find2Err };
          return res.status(header.error_code).send({ header });
        }

        if (!userOther) {
          header = { error_code: 404, message: 'User not found' };
          return res.status(header.error_code).send({ header });
        }

        const userPrivate = getPrivateUser(userOther);
        header = {
          error_code: 200,
          message: 'Successfully found other user(Following)',
        };
        return res.status(header.error_code).send({ header, userPrivate });
      });
    }

    // If I dont follow the other user
    else {
      User.findOne({ username: otherUsername }, (find2Err, userOther) => {
        if (find2Err) {
          header = { error_code: 500, message: find2Err };
          return res.status(header.error_code).send({ header });
        }

        if (!userOther) {
          header = { error_code: 404, message: 'User not found' };
          return res.status(header.error_code).send({ header });
        }

        // If other user is public
        if (!userOther.privacy) {
          const userPrivate = getPrivateUser(userOther);
          header = {
            error_code: 200,
            message: 'Successfully found other user(Public)',
          };
          return res.status(header.error_code).send({ header, userPrivate });
        }

        // If other user is private
        const userPublic = getPublicUser(userOther);
        header = {
          error_code: 200,
          message: 'Successfully found other user(Private & NF)',
        };
        return res.status(200).send({ header, userPublic });
      });
    }
  });
};

exports.editMyProfile = (req, res) => {
  User.findOne({ username: req.decoded.username }, (findErr, user) => {
    if (findErr) {
      header = { error_code: 500, message: findErr };
      return res.status(header.error_code).send({ header });
    }

    if (!user) {
      header = { error_code: 404, message: 'User not found' };
      return res.status(header.error_code).send({ header });
    }

    if (req.body.firstname) user.firstname = req.body.firstname;
    if (req.body.lastname) user.lastname = req.body.lastname;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio) user.profile.bio = req.body.bio;
    if (req.body.privacy) user.privacy = req.body.privacy;

    user.save((saveErr, savedUser) => {
      if (saveErr) {
        header = { error_code: 500, message: saveErr };
        return res.status(header.error_code).send({ header });
      }

      header = { error_code: 200, message: 'User updated successfully' };
      return res.status(header.error_code).send({ header, savedUser });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: 'Internal server error' };
      return res.status(header.error_code).send({ header });
    }

    if (user) {
      if (password !== user.password) {
        header = { error_code: 401, message: 'Incorrect password' };
        return res.status(header.error_code).send({ header });
      }
      header = { error_code: 200, message: 'Login successful' };
      const userSignObj = { username };
      const accessToken = jwt.sign(userSignObj, config.SECRET_KEY, {
        expiresIn: '10h',
      });
      return res.status(header.error_code).send({ header, accessToken });
    }

    header = { error_code: 404, message: 'User not found' };
    return res.status(header.error_code).send({ header });
  });
};

exports.register = (req, res) => {
  console.log(req.body);
  const { email, username } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      header = { error_code: 500, message: err };
      return res.status(header.error_code).send({ header });
    }

    if (user) {
      header = { error_code: 403, message: 'Email already exists' };
      return res.status(header.error_code).send({ header });
    }
    // eslint-disable-next-line no-unused-vars
    User.findOne({ username }, (findUsernameErr, userFound) => {
      if (findUsernameErr) {
        header = { error_code: 500, message: findUsernameErr };
        return res.status(header.error_code).send({ header });
      }

      if (userFound) {
        header = { error_code: 403, message: 'Username already exists' };
        return res.status(header.error_code).send({ header });
      }

      const newUser = getNewUser(req.body);
      newUser.save((saveErr) => {
        if (saveErr) {
          header = { error_code: 500, message: saveErr };
          return res.status(header.error_code).send({ header });
        }

        header = {
          error_code: 200,
          message: 'User created successfully',
        };
        const userSignObj = { username };
        const accessToken = jwt.sign(userSignObj, config.SECRET_KEY, {
          expiresIn: '10h',
        });
        return res
          .status(header.error_code)
          .send({ header, newUser, accessToken });
      });
    });
  });
};

/* eslint-disable consistent-return */
let header = {
  status_code: String,
  message: String,
};
const FollowRelationship = require('../models/followRelationship');
const User = require('../models/user');

exports.sendRequest = async (req, res) => {
  const myUsername = req.decoded.username;
  const requestedUsername = req.query.username;

  try {
    const myUser = await User.findById(myUsername).exec();
    const requestedUser = await User.findById(requestedUsername).exec();

    if (!myUser) {
      header = { status_code: 404, message: `User '${myUsername}' not found` };
      return res.status(404).send({ header });
    }

    if (!requestedUser) {
      header = {
        status_code: 404,
        message: `User '${requestedUsername}' not found`,
      };
      return res.status(404).send({ header });
    }

    const oldRelationship = await FollowRelationship.findOne({
      sender: myUsername,
      receiver: requestedUsername,
    }).exec();

    // If there is no relationship, create one
    if (!oldRelationship) {
      console.log('no result');
      const newRelationshipEntry = new FollowRelationship({
        sender: myUsername,
        receiver: requestedUsername,
        status: 'pending',
      });
      const newRelationship = await newRelationshipEntry.save();
      header = { status_code: 200, message: 'Successfully sent request.' };
      return res.status(header.status_code).send({ header, newRelationship });
    }

    // If relationship is already pending, return error
    if (oldRelationship.status === 'pending') {
      header = {
        status_code: 400,
        message: `You have already sent a req to '${requestedUsername}'`,
      };
      return res.status(header.status_code).send({ header });
    }

    // If there is a relationship but not pending, update it
    oldRelationship.status = 'pending';
    const newRelationship = await oldRelationship.save();
    header = { status_code: 200, message: 'Successfully sent request.' };
    return res.status(header.status_code).send({ header, newRelationship });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

exports.acceptRequest = async (req, res) => {
  const myUsername = req.decoded.username;
  const requestedUsername = req.query.username;

  try {
    const oldRelationship = await FollowRelationship.findOne({
      sender: requestedUsername,
      receiver: myUsername,
    }).exec();

    // If there is no request, return error
    if (!oldRelationship || oldRelationship.status !== 'pending') {
      header = {
        status_code: 400,
        message: `You do not have a request from '${requestedUsername}'`,
      };
      return res.status(header.status_code).send({ header });
    }

    oldRelationship.status = 'accepted';
    const newRelationship = await oldRelationship.save();
    header = { status_code: 200, message: 'Successfully accepted request.' };
    return res.status(header.status_code).send({ header, newRelationship });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

exports.rejectRequest = async (req, res) => {
  const myUsername = req.decoded.username;
  const requestedUsername = req.query.username;

  try {
    const oldRelationship = await FollowRelationship.findOne({
      sender: requestedUsername,
      receiver: myUsername,
    }).exec();

    // If there is no request, return error
    if (!oldRelationship || oldRelationship.status !== 'pending') {
      header = {
        status_code: 400,
        message: `You do not have a request from '${requestedUsername}'`,
      };
      return res.status(header.status_code).send({ header });
    }

    oldRelationship.status = 'none';
    const newRelationship = await oldRelationship.save();
    header = { status_code: 200, message: 'Successfully rejected request.' };
    return res.status(header.status_code).send({ header, newRelationship });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

exports.getRequests = async (req, res) => {
  const myUsername = req.decoded.username;
  try {
    let requests = await FollowRelationship.find(
      {
        receiver: myUsername,
        status: 'pending',
      },
      'sender'
    )
      .populate('sender')
      .exec();

    requests = JSON.parse(
      JSON.stringify(requests).split('"sender":').join('"user":')
    );
    header = { status_code: 200, message: 'Got requests' };
    return res.status(header.status_code).send({ header, requests });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

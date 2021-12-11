/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */

let header = {
  status_code: String,
  message: String,
};
const FollowRelationship = require('../models/followRelationship');

exports.getFollowers = async (req, res) => {
  const myUsername = req.decoded.username;
  try {
    const followers = await FollowRelationship.find(
      {
        receiver: myUsername,
        status: 'accepted',
      },
      'sender'
    )
      .populate('sender')
      .exec();
    header = { status_code: 200, message: 'Got followers' };
    return res.status(header.status_code).send({ header, followers });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

exports.getFollowing = async (req, res) => {
  const myUsername = req.decoded.username;
  try {
    const following = await FollowRelationship.find(
      {
        sender: myUsername,
        status: 'accepted',
      },
      'receiver'
    )
      .populate('receiver')
      .exec();
    header = { status_code: 200, message: 'Got following' };
    return res.status(header.status_code).send({ header, following });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

exports.unfollow = async (req, res) => {
  const myUsername = req.decoded.username;
  const unfollowUsername = req.query.username;

  try {
    const oldRelationship = await FollowRelationship.findOne({
      sender: myUsername,
      receiver: unfollowUsername,
    }).exec();

    if (!oldRelationship || oldRelationship.status !== 'accepted') {
      header = {
        status_code: 404,
        message: `Cannot unfollow someone you don't follow`,
      };
      return res.status(404).send({ header });
    }
    oldRelationship.status = 'none';
    const newRelationship = await oldRelationship.save();
    const followersCount = await FollowRelationship.countDocuments({
      receiver: unfollowUsername,
      status : 'accepted'
    }).exec();
    console.log('sdfghj', followersCount);
    header = { status_code: 200, message: 'Successfully unfollowed.' };
    return res.status(header.status_code).send({ header, newRelationship , followersCount});
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

// Remove from following of other person
exports.removeFollower = async (req, res) => {
  const myUsername = req.decoded.username;
  const removeUsername = req.query.username;

  try {
    const oldRelationship = await FollowRelationship.findOne({
      sender: removeUsername,
      receiver: myUsername,
    }).exec();

    if (!oldRelationship || oldRelationship.status !== 'accepted') {
      header = {
        status_code: 404,
        message: `Cannot remove follower if they don't follow you`,
      };
      return res.status(404).send({ header });
    }

    oldRelationship.status = 'none';
    const newRelationship = await oldRelationship.save();
    header = { status_code: 200, message: 'Successfully removed follower.' };
    return res.status(header.status_code).send({ header, newRelationship });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

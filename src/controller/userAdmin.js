const User = require('../models/user');

let header = {
  status_code: String,
  message: String,
};

exports.deleteAll = (req, res) => {
  User.deleteMany()
    .then((result) => {
      header = { status_code: 200, message: 'All users deleted' };
      res.status(header.status_code).send({ header, result });
    })
    .catch((err) => {
      header = { status_code: 500, message: 'Error: Deleting all users' };
      res.status(header.status_code).send({ header, err });
    });
};

exports.findAll = (req, res) => {
  User.find()
    .then((result) => {
      header = { status_code: 200, message: 'All users found' };
      res.status(header.status_code).send({ header, result });
    })
    .catch((err) => {
      header = { status_code: 500, message: 'Error: Finding all users' };
      res.status(header.status_code).send({ header, err });
    });
};

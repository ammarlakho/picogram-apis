/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const config = require('../../config');

const jwtAuth = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    const header = { status_code: 401, message: 'No token provided.' };
    return res.status(header.status_code).send({ header });
  }

  jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
    if (err) {
      const header = {
        status_code: 500,
        message: 'Failed to authenticate token.',
      };
      return res.status(header.status_code).send({ header });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = { jwtAuth };

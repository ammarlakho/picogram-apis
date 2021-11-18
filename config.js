require('dotenv').config();

const config = {
  PORT: 9000,
  MONGO_URI: process.env.dbUrlMongoDB,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  SECRET_KEY: process.env.SECRET_KEY,
};

module.exports = config;

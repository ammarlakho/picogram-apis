require('dotenv').config();

const config = {
  PORT: 9000,
  MONGO_URI: process.env.dbUrlMongoDB,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  SECRET_KEY: process.env.SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

module.exports = config;

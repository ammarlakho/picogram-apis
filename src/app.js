const express = require('express');
// const expressip = require('express-ip');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const { router } = require('./routes.js');
const { connectDB } = require('./connection');

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  // // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', '*');

  // // Request methods you wish to allow
  // res.setHeader(
  //   'Access-Control-Allow-Methods',
  //   'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  // );

  // // Request headers you wish to allow
  // res.setHeader(
  //   'Access-Control-Allow-Headers',
  //   'X-Requested-With,content-type'
  // );

  // // Set to true if you need the website to include cookies in the requests sent
  // // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

connectDB();
app.use('/', router);

module.exports = app;

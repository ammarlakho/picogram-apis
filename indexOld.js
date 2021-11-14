const connectDB = require('./connection')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');

const router = require('./router.js');
dotenv.config()
const secretKey = process.env.SECRET_KEY;

const app = express()
app.use(express.json())
app.use(cors())
connectDB();



//defining routes

app.get("/me", (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      res.status(200).send(decoded);
    });
})

app.use('/', router);




app.listen(9002, ()=> {
    console.log("started at port 9002")
})

const connectDB = require('./connection')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

dotenv.config({path: '.env'})
const PORT = 3001;

// log requests
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());

// Mongodb Connection
connectDB();

// load routers
app.use('/', require('./router'))

app.listen(PORT, ()=>{console.log(`Server is running on http://localhost:${PORT}`)});
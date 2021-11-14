const express = require('express');
const userProfileController = require('./controller/userProfileController.js');
const { jwtAuth } = require('./middlewares/validateAuth');

const router = express.Router();

// Login/Register
router.post('/login', userProfileController.login);
router.post('/register', userProfileController.register);

// My Profile
router.get('/get-profile/:username', jwtAuth, userProfileController.getProfile);
router.put('/edit-my-profile', jwtAuth, userProfileController.editMyProfile);

module.exports = { router };

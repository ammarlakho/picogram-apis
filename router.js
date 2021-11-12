const express = require('express');
const userController = require('./controller/userController.js')

const router = express.Router();

// Login/Register
router.post('/login', userController.login);
router.post('/register', userController.register);

// My Profile
router.get('/get-my-profile', userController.getMyProfile);
router.put("/edit-my-profile", userController.editMyProfile);

// Other Profile
router.get('/get-other-profile', userController.getOtherProfile);

module.exports = router;
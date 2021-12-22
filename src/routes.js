const express = require('express');
// const multer = require('multer');
const userProfile = require('./controller/userProfile.js');
const userFollow = require('./controller/userFollow.js');
const userAdmin = require('./controller/userAdmin.js');
const userRequests = require('./controller/userRequests.js');
const userPosts = require('./controller/userPosts.js');
const userLikes = require('./controller/userLikes.js')
const { jwtAuth } = require('./utils/validateAuth');
const upload = require('./utils/multer');

const router = express.Router();

// Login/Register
router.post('/login', userProfile.login);
router.post('/register', userProfile.register);

// My Profile
router.get('/profile', jwtAuth, userProfile.getProfile);
router.get('/profile/?:username', jwtAuth, userProfile.getProfile);
router.put('/edit-my-profile', jwtAuth, userProfile.editMyProfile);

// Requests
router.get('/requests', jwtAuth, userRequests.getRequests);
router.post('/send-request', jwtAuth, userRequests.sendRequest);
router.post('/accept-request', jwtAuth, userRequests.acceptRequest);
router.delete('/reject-request', jwtAuth, userRequests.rejectRequest);

// Follow/Unfollow
router.get('/followers', jwtAuth, userFollow.getFollowers);
router.get('/following', jwtAuth, userFollow.getFollowing);
router.delete('/unfollow', jwtAuth, userFollow.unfollow);
router.delete('/remove-follower', jwtAuth, userFollow.removeFollower);

// Posts
router.post(
  '/create-post',
  jwtAuth,
  upload.single('postImage'),
  userPosts.createPost
);
router.delete('/delete-post', jwtAuth, userPosts.deletePost);
//likes/viewlikes
router.post('/like', jwtAuth,userLikes.like);
// router.get('/getLikes', jwtAuth, userLikes.getLikes);

// Admin Queries
router.get('/', userAdmin.findAll);
router.get('/users', userAdmin.findAll);
router.delete('/delete-all', userAdmin.deleteAll);
const Post = require('./models/post');

router.delete('/delete-all-posts', async (req, res) => {
  await Post.deleteMany().exec();
  res.send('Deleted everything');
});
module.exports = { router };

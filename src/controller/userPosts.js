/* eslint-disable consistent-return */
// const multer = require('multer');

// const upload = multer({ dest: 'images/' });
const cloudinary = require('../utils/cloudinary');

let header = {
  status_code: String,
  message: String,
};
const Post = require('../models/post');
const FollowRelationship = require('../models/followRelationship');
const Like = require('../models/like')

exports.createPost = async (req, res) => {
  const myUsername = req.decoded.username;
  try {
    console.log("hi");
    console.log("req", req.body);
    const cdnResponse = await cloudinary.uploader.upload(req.file.path);
    console.log('cdnResponse', cdnResponse);
    const post = new Post({
      poster: myUsername,
      caption: req.body.caption,
      date: new Date(),
      url: cdnResponse.secure_url,
      cloudinary_id: cdnResponse.public_id,
    });
    const savedPost = await post.save();
    header = { status_code: 200, message: 'Created Post' };
    return res.status(header.status_code).send({ header, savedPost });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

exports.deletePost = async (req, res) => {
  const myUsername = req.decoded.username;
  try {
    const post = await Post.findById(req.body.post_id).exec();

    if (post.poster !== myUsername) {
      header = { status_code: 401, message: 'Not authorized to delete post' };
      return res.status(header.status_code).send({ header });
    }

    if (!post) {
      header = {
        status_code: 404,
        message: `Post '${req.body.post_id}' not found`,
      };
      return res.status(404).send({ header });
    }
    const deletedCloudinaryResponse = await cloudinary.uploader.destroy(
      post.cloudinary_id
    );
    const deletedMongoResponse = await Post.deleteOne({
      _id: req.body.post_id,
    }).exec();
    header = { status_code: 200, message: 'Deleted Post' };
    return res
      .status(header.status_code)
      .send({ header, deletedCloudinaryResponse, deletedMongoResponse });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

exports.getHome = async (req, res) => {
  const myUsername = req.decoded.username;
  const following = await FollowRelationship.find({sender: myUsername, status: 'accepted'}, 'receiver').exec();
  const followingStrings = following.map(f => f.receiver);
  try {
    const posts = await Post.find({  
        "poster":{"$in": followingStrings},
    }).exec();
    const likesArray = []
    for (let i=0; i<posts.length; i++) {
      try {
        const likesCount = await Like.countDocuments(
          {
              post : posts[i]._id
          }
        ).exec();
        console.log(likesCount);
        likesArray.push(likesCount)
        posts[i].likesCount = likesCount;
      }
      catch (err) {
        console.log(err)
      }
      
    }

    header = { status_code: 200, message: 'Got posts' };
    return res.status(header.status_code).send({ header, posts, likesArray });
  } catch (err) {
    header = { status_code: 500, message: err };
    return res.status(header.status_code).send({ header });
  }
};

// get-posts-home
// edit-post

let header = {
    status_code: String,
    message: String,
  };

const Like = require('../models/like');
 
  
  exports.like = async (req, res) => {
    const liker = req.decoded.username;
    const post = req.query.post;
    try {
      let liked = await Like.findOne(
        {
          liker : liker,
          post: post,
        }
      ) .exec();

    
      if (!liked){
        const like = new Like({
            liker: liker,
            post: post,
            
          });
          const savedLike = await like.save();
          header = {
            status_code: 200,
            message: `Post successfully liked`,
          };
      }
      if (liked){
        const deleted = await Like.deleteOne({ liker: req.decoded.username , post: req.query.post }).exec();
        header = {
            status_code: 200,
            message: `Post successfully unliked`,
          };
    }
    return res.status(header.status_code).send({ header});
      
  
     
    } catch (err) {
        header = { status_code: 500, message: err };
        return res.status(header.status_code).send({ header });
     
    }
  };

//   exports.getLikes = async (req, res) => {
//     const liker = req.decoded.username;
//     try {
//         const likesCount = Like.countDocuments(
//             {

//             }
//         )
//     }
//   }
  
 
  

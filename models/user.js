const mongoose = require('mongoose');
const postSchema = require('./post').schema;



const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    email: {
        type: String,
        requried: true
    }, 
    password: {
        type: String,
        required: true
    },
    privacy : {
       type: Boolean,
       required: true
    },
    bio: { 
        type: String,
        required: true
    },
    pictures : [postSchema],
    followers : [String],
    following : [String],
    requests : [String],

})

const User = mongoose.model('User', userSchema);

module.exports = User;


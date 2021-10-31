const connectDB = require('./connection')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const secretKey = "1"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
connectDB();

const userSchema = require('./models/user').schema
const profileSchema = require('./models/profile').schema
const postSchema = require('./models/post').schema
const commentSchema = require('./models/comment').schema

const User = new mongoose.model("User", userSchema)
const Profile = new mongoose.model("Profile", profileSchema)
const Comments = new mongoose.model("Comments", commentSchema)
const Posts = new mongoose.model("Post", postSchema)


const header = {
    error_code : String,
    message : String
}


//defining routes

app.get("/me", (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      res.status(200).send(decoded);
    });
})

app.get("/get-my-profile", (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      User.findOne({username: decoded.username}, (err, user) => {
        if(err) return res.status(500).send({error_code: 500, message: "Internal server error"})
        if(!user) return res.status(404).send({error_code: 404, message: "User not found"})
        res.status(200).send(user)
      })
    });
})

app.get("/get-other-profile", (req, res) => {
    var token = req.headers['x-access-token'];
    var usernameOther = req.query.username
    console.log("usernameOther", usernameOther)
    if(!usernameOther) return res.status(400).send({error_code: 400, message: "No username specified"})
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      User.findOne({username: decoded.username}, (err, user) => {
        if(err) return res.status(500).send({error_code: 500, message: "Internal server error"})
        if(!user) return res.status(404).send({error_code: 404, message: "User not found"})
        console.log("hi1")
        const tempFollowing = user.following
        console.log(tempFollowing)
        const found = tempFollowing.find((userFoll, index) => {

            if(userFoll == usernameOther) {
                User.findOne({username: usernameOther}, (err, userOther) => {
                    if(err) return res.status(500).send({error_code: 500, message: "Internal server error"})
                    if(!userOther) return res.status(404).send({error_code: 404, message: "User not found"})
                    console.log(userOther)
                    res.status(200).send({
                        firstname: userOther.firstname,
                        lastname : userOther.lastname,
                        username : userOther.username,
                        bio: userOther.bio,
                        pictures : userOther.pictures,
                        followers : userOther.followers,
                        following : userOther.following,
                        requests : userOther.requests,
                    })
                })
                return true
            }
        })
        if(!found) {
            User.findOne({username: usernameOther}, (err, userOther) => {
                if(err) return res.status(500).send({error_code: 500, message: "Internal server error"})
                if(!userOther) return res.status(404).send({error_code: 404, message: "User not found"})
                res.status(200).send({
                    username: userOther.username,
                    firstname: userOther.firstname,
                    lastname: userOther.lastname,
                    email: userOther.email,
                    privacy: userOther.privacy,
                    bio: userOther.bio,
                    followersCount : userOther.followers.length,
                    followingCount : userOther.following.length,
                })
            })
        }
      })
    });
})

app.put("/edit-my-profile", (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      User.findOne({username: decoded.username}, (err, user) => {
        if(err) return res.status(500).send({error_code: 500, message: "Internal server error"})
        if(!user) return res.status(404).send({error_code: 404, message: "User not found"})
        if(req.body.firstname) user.firstname = req.body.firstname
        if(req.body.lastname) user.lastname = req.body.lastname
        if(req.body.email) user.email = req.body.email
        if(req.body.bio) user.bio = req.body.bio
        if(req.body.privacy) user.privacy = req.body.privacy
        
        user.save((err, user) => {
            if(err) return res.status(500).send({error_code: 500, message: "Internal server error"})
            res.status(200).send(user)
        })
      })
    });
})


app.post("/login", (req,res) => {
    const{ username, password} = req.body
    User.findOne({username : username},(err,user) => {
        if (user){
            if (password === user.password){
                header.error_code = "1"
                header.message = "Login Succeeded"
                const userObj = {username: username}
                const accessToken = jwt.sign(userObj, secretKey, {expiresIn : "1h"})
               
                res.json({header, user, accessToken})
            }
            else{
                header.error_code = "2"
                header.message = "Incorrect Password"
                res.send({header})
            }
        }
        else{
            header.error_code = "3"
            header.message = "User not registered"
            res.send({header})
        }
    })
})

app.post("/register", (req,res) => {
    console.log(req.body)
    const{firstname,lastname, email, password, privacy, username} = req.body
    User.findOne({email: email}, (err, user) => {
        if (user){
            header.error_code = "4"
            header.message = "User already registered"
            res.send({header})
        } 
        else { 
            User.findOne({username: username}, (err, user) => {
                if (user){
                    header.error_code = "4"
                    header.message = "User already registered"
                    res.send({header})
                } 
                else {
                    const user = new User(req.body)
                    user.save(err => {
                        if(err) {
                            res.send(err)
                        } else {
                            header.error_code = "5"
                            header.message = "Successfully registered"
                            const userObj = {name : req.username}
                            const accessToken = jwt.sign(userObj, secretKey, {expiresIn : "1h"})
                            res.send({header,user,accessToken})
                        }
                    })
                }
            })
        }
    })
})




app.listen(9002, ()=> {
    console.log("started at port 9002")
})

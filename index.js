const connectDB = require('./connection')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');

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
    error_code: String,
    message: String

}


//defining routes

app.post("/login", (req, res) => {
    const { username, password } = req.body
    User.findOne({ username: username }, (err, user) => {
        if (user) {
            if (password === user.password) {
                header.error_code = "1"
                header.message = "Login Succeeded"
                const userObj = { name: username }
                const accessToken = jwt.sign(userObj, "hello")

                res.json({ header, user, accessToken })
            }
            else {
                header.error_code = "2"
                header.message = "Incorrect Password"
                res.send({ header })
            }
        } else {
            header.error_code = "3"
            header.message = "User not registered"
            res.send({ header })
        }
    })
})

app.post("/register", (req, res) => {
    console.log(req.body)
    const { firstname, lastname, email, password, privacy, username } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            header.error_code = "4"
            header.message = "User already registered"
            res.send({ header })
        }
        else {
            User.findOne({ username: username }, (err, user) => {
                if (user) {
                    header.error_code = "4"
                    header.message = "User already registered"
                    res.send({ header })
                }
                else {
                    const user = new User(req.body)
                    user.save(err => {
                        if (err) {
                            res.send(err)
                        } else {
                            header.error_code = "5"
                            header.message = "Successfully registered"
                            const userObj = { name: req.username }
                            const accessToken = jwt.sign(userObj, "helo")
                            res.send({ header, user, accessToken })
                        }
                    })
                }
            })
        }
    })
})

app.post("/unfollow", (req, res) => {

    console.log("req.body", req.body)
    console.log("req.myId", req.body.myId)
    console.log("req.unfollowUsername", req.body.unfollowUsername)

    Profile.findOne({ _id: req.body.myId }, (err, user) => {
        if (user) {
            const tempFollowing = user.following
            const found = tempFollowing.find((userfoll, index) => {
                if (userfoll == req.body.unfollowUsername) {
                    tempFollowing.splice(index, 1)

                    Profile.update({ "_id": user._id }, { $set: { "following": tempFollowing } }, (err, resData) => {
                        console.log("e1", err)
                        console.log("r1", resData)
                    })
                    header.error_code = 6
                    header.message = "User Unfollowed"
                    const currentFollowing = user.following
                    res.send({ header, tempFollowing, currentFollowing })
                    return true
                }

            })

            if (!found) {
                header.error_code = 7
                header.message = "You are not following this user"
                res.send({ header })
            }

        }


    })


})
app.get("/followers", (req, res) => {
    Profile.findOne({ _id: req.query.myId }, (err, user) => {
        if (user) {
            header.error_code = 10
            header.message = "followers"
            const followers = user.followers
            res.send({ header, followers })
        }

    })
})

app.get("/following", (req, res) => {
    Profile.findOne({ _id: req.query.myId }, (err, user) => {
        if (user) {
            header.error_code = 10
            header.message = "following"
            const following = user.following
            res.send({ header, following })
        }

    })
})

app.post("/followReq", (req, res) => {
    Profile.findOne({ _id: req.body.reqId }, (err, user) => {
        if (user) {
            header.error_code = 10
            header.message = "request sent"
            const requests = user.requests
            requests.push(req.body.newrequest)

            Profile.update({ "_id": user._id }, { $set: { "requests": requests } }, (err, resData) => {
                console.log("e1", err)
                console.log("r1", resData)
            })
            const currentrequests = user.requests
            res.send({header, requests, currentrequests})

        }
    }
    )
})



app.listen(9002, () => {
    console.log("started at port 9002")
})

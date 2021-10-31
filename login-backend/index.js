import dotenv from "dotenv"

import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/myLoginApp",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("Database Connected")
})

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname : String,
    username : String,
    privacy : Boolean,
    email: String,
    bio : String,
    password : String
})

const commentSchema = new mongoose.Schema({
    username: String,
    text: String,
    like: Number
})



const postSchema = new mongoose.Schema({
    username: String,
    
    caption: String,
    like: Number,
    comments: [commentSchema]
})


const profileSchema = new mongoose.Schema({
    username : String,
    pictures : [postSchema],
    followers :  [userSchema],
    following : [userSchema],

})

const User = new mongoose.model("User", userSchema)
const Profile = new mongoose.model("Profile", profileSchema)
const Comments = new mongoose.model("Comments", commentSchema)
const Posts = new mongoose.model("Post", postSchema)


const header = {
    error_code : String,
    message : String

}


//defining routes

app.post("/login", (req,res) => {
    const{ username, password} = req.body
    User.findOne({username : username},(err,user) => {
        if (user){
            if (password === user.password){
                header.error_code = "1"
                header.message = "Login Succeeded"
                const userObj = {name : username}
                const accessToken = jwt.sign(userObj, "hello")
               
                res.json({header, user, accessToken})
                

              
                
            }
            else{
                header.error_code = "2"
                header.message = "Incorrect Password"
                res.send({header})
            }
        }else{
            header.error_code = "3"
            header.message = "User not registered"
            res.send({header})
        }
    })
})

app.post("/register", (req,res) => {
    console.log(req.body)
    const{firstname,lastname, email, password, privacy} = req.body
    User.findOne({email: email}, (err, user) => {
        if (user){
            header.error_code = "4"
            header.message = "User already registered"
            res.send({header})
        } else{
    
            const user = new User({
                firstname,
                lastname,
                email,
                password,
                privacy
    })
    user.save(err => {
        if(err) {
            res.send(err)
        } else {
            header.error_code = "5"
            header.message = "Successfully registered"
            const userObj = {name : email}
            const accessToken = jwt.sign(userObj, "helo")
            res.send({header,user,accessToken})
        }
    })
}

})
})

app.post("/unfollow", (req,res) => {
    const {id, username} = req.body
    Profile.findOne({userid : id}, (err, user) => {
        if (user){
            
            const userFollowing = user.following
           const found =  userFollowing.find((userfoll, index) => {
                if(userfoll.username == username)
                {
                    
                  user.following.splice(index,1)
                  
                    return true
                }

            })
          
            if (found){
            header.error_code = 6
            header.message = "User Unfollowed"
            res.send({header})
            }
            else {
                header.error_code = 7
                header.message = "You are not following this user"
                res.send({header})
            }
            
        }
       

    })
    

})

app.listen(9002, ()=> {
    console.log("started at port 9002")
})

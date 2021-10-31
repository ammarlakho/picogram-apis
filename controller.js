// const mongoose = require('mongoose');

// var userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true
//     },

// })

// const User = mongoose.model('User', userSchema);

// // module.exports = User;

// exports.register = (req, res) => {
//     console.log("Register")
//     console.log(req.body)
//     if(!req.body) {
//         res.status(400).send({message: "Content cannot be empty!"});
//         return;
//     }

//     // Validate email
//     User.findOne({
//         email: req.body.email,
//     })
//     .then(user => {
//         console.log(user)
//         if(user) {
//             res.status(400).send({message: "You already have an account!"})
//         }
//         else {
//             // Save user
//             var user = new User(req.body);
//             user.save()
//             .then(data => {
//                 res.status(200).send({message: "Registered!", user}); 
//             })
//             .catch(err => {
//                 // res.status(400).send({message: "Some error in creating new account"}); 
//                 res.status(400).send({message: err.message || "Some error in creating new account"});
//             })
//         }
//     })
//     .catch(err => {
//         res.status(500).send({message: "Error in validating email"})
//     })

    
// }

// exports.login = (req, res) => {
//     console.log("Login")
//     console.log(req.body)
//     if(!req.body) {
//         res.status(400).send({message: "Content cannot be empty!"});
//         return;
//     }
    
//     User.findOne({
//         email: req.body.email,
//     })
//     .then(user => {
//         console.log(user)
//         if(user) {
//             if (req.body.password === user.password) {
//                 res.status(200).send({message: "Logged in!", user})
//                 console.log('hi')
//             }
//             else {
//                 res.status(400).send({message: "Incorrect password!"})
//             }
//         }
//         else {
//             res.status(404).send({message: "User doesn't exist"})
//         }
//     })
//     .catch(err => {
//         res.status(500).send({message: "Error in  getting user"})
//     })
// }

// exports.deleteAll = (req, res) => {
//     console.log("Delete All")
    
//     User.deleteMany()
//     .then(result => {
//         res.status(200).send({message: "All users deleted"})
//     })
//     .catch(err => {
//         res.status(500).send({message: err.message || "Some error occurred while deleting all users"})
//     })
// }

// exports.findAll = (req, res) => {
//     console.log("Find All")

//     User.find()
//     .then(result => {
//         res.send(result)
//     })
//     .catch(err => {
//         res.status(500).send({message: err.message || "Some error occurred while finding all users"})
//     })
// }
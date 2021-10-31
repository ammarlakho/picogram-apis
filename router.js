const express = require('express');
const router = express.Router();
const controller = require('./controller');

// router.get('/', (req, res) => {
//     res.send("Server Home Page")
// })

// router.post('/api/users/register', controller.register);
// router.post('/api/users/login', controller.login);

// router.delete('/api/users/deleteAll', controller.deleteAll);
// router.get('/api/users/findAll', controller.findAll);

module.exports = router;

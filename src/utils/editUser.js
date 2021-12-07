/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
const User = require('../models/user');

let header = {
  status_code: String,
  message: String,
};
let errorCode;
let responseObj;

const editUserArray = (myUsername, otherUsername, arrayName, addOrDelete) => {

    User.findOne({ username: myUsername})
    .then(user => {
        if (!user) {
            header = { status_code: 404, message: 'User not found' };
            responseObj = { header };
            errorCode = header.status_code;
            return [errorCode, responseObj];
        } 

        if (addOrDelete === 'delete') {
            console.log('in delete');
            const index = user.profile[arrayName].indexOf(otherUsername);
            if (index === -1) {
              console.log('in index -1');
              header = {
                status_code: 400,
                message: `You are not following/being followed by this user '${otherUsername}''`,
              };
              responseObj = { header };
              errorCode = header.status_code;
              console.log('hereee');
              console.log(responseObj);
              console.log(errorCode);
              return [errorCode, responseObj];
            } 

            console.log('initial length: ', user.profile[arrayName].length);
            user.profile[arrayName].splice(index, 1);
            console.log('final length: ', user.profile[arrayName].length);
            
          } else if (addOrDelete === 'add') {
            console.log('initial length: ', user.profile[arrayName].length);
            user.profile[arrayName].push(otherUsername);
            console.log('final length: ', user.profile[arrayName].length);
          }
    
          // eslint-disable-next-line consistent-return
          user.save()
          .then(savedUser => {
                header = {
                    status_code: 200,
                    message: 'User(follower) updated successfully',
                };
                responseObj = { header, savedUser };
                errorCode = header.status_code;
          })
          .catch(err => {
            header = { status_code: 500, message: err };
            responseObj = { header };
            errorCode = header.status_code;
          })
          return [errorCode, responseObj];
    })
    .catch(err => {
        header = { status_code: 500, message: err };
        responseObj = { header };
        errorCode = header.status_code;
        return [errorCode, responseObj];
    });

  console.log('returning: ', errorCode, responseObj);
  return [errorCode, responseObj];
};

module.exports = {
  editUserArray,
};

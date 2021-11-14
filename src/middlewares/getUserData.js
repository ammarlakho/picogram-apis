const getPublicUser = (userOther) => {
  return {
    username: userOther.username,
    firstname: userOther.firstname,
    lastname: userOther.lastname,
    email: userOther.email,
    privacy: userOther.privacy,
    bio: userOther.bio,
    followersCount: userOther.followers.length,
    followingCount: userOther.following.length,
  };
};

const getPrivateUser = (userOther) => {
  return {
    firstname: userOther.firstname,
    lastname: userOther.lastname,
    username: userOther.username,
    bio: userOther.bio,
    pictures: userOther.pictures,
    followers: userOther.followers,
    following: userOther.following,
    requests: userOther.requests,
  };
};

module.exports = {
  getPublicUser,
  getPrivateUser,
};

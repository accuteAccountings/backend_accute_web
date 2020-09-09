const { Users } = require("../db/db");
const { token_gen } = require("../utils/token_gen");

async function isUserExist(username) {
  let user = await Users.findOne({
    where: {
      username: username
    }
  }).catch(err => {
    console.log("isUserExist fucntion error :- " + err);
    return { error: "unable to check username" };
  });

  if (user) {
    return true;
  } else {
    return false;
  }
}
async function isUserExistEmail(email) {
  let user = await Users.findOne({
    where: {
      email
    }
  }).catch(err => {
    console.log("isUserExistEmail fucntion error :- " + err);
    return { error: "unable to check email" };
  });

  if (user) {
    return user;
  } else {
    return false;
  }
}

async function createNewUser(reqUser) {
  let user = false;

  let token = token_gen(15);

  let newUser = await Users.create({
    username: reqUsr.email,
    password: reqUser.password,
    email: reqUser.email,
    phone_num: reqUser.mob_num,
    full_name: reqUser.full_name,
    token: token
  })
    .catch(err => {
      console.log("Unable to create New User with error :-" + err);
      user = { user: { error: "server error user can not be created" } };
    })
    .then(u => {
      if (u) {
        user = {
          user: {
            username: u.username,
            token: u.token
          }
        };
      }
    });

  return user;
}
async function createNewUserGoogle(reqUser) {
  let user = false;

  let token = token_gen(15);
  let username = token_gen(6);

  let newUser = await Users.create({
    username: username,

    email: reqUser.email,
    full_name: reqUser.name,
    pro_img: reqUser.pro_pic,
    token: token
  })
    .catch(err => {
      console.log("Unable to create New User with error :-" + err);
      user = { user: { error: "server error user can not be created" } };
    })
    .then(u => {
      if (u) {
        user = {
          user: {
            email: u.email,
            token: u.token
          }
        };
      }
    });

  return user;
}

async function getUserByUsername(username) {
  try {
    let user = await Users.findOne({
      attributes: ["username", "full_name", "email", "phone_num", "occupation", "pro_img"],
      where: {
        username: username
      }
    });

    if (user) {
      if (user.username) {
        return user;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

module.exports = { getUserByUsername, isUserExist, isUserExistEmail, createNewUser, createNewUserGoogle };

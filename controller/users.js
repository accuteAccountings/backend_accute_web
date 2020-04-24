const { Users } = require('../db/db')
const { token_gen } = require('../utils/token_gen')


async function isUserExist(username) {

    let user = await Users.findOne({
        where: {
            username: username
        }
    })
        .catch((err) => {
            console.log("isUserExist fucntion error :- " + err)
            return { error: "unable to check username" }
        })


    if (user) {
        return true;
    }
    else {
        return false;
    }


}


async function createNewUser(reqUser) {


    let user = false;

    let token = token_gen(15);

    console.log(reqUser)

    let newUser = await Users.create({

        username: reqUser.username,
        password: reqUser.password,
        email: reqUser.email,
        phone_num: reqUser.phone_num,
        occupation: reqUser.occupation,
        full_name: reqUser.full_name,
        token: token,

    })
        .catch((err) => {

            console.log("Unable to create New User with error :-" + err);
            user = false;
        })


        .then((u) => {
            if (u) {
                user = {
                    user: {
                        username: u.username,
                        token: u.token
                    }
                }
            }
        })




    return user;
}












module.exports = { isUserExist, createNewUser }
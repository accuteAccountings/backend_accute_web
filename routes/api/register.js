const route = require('express').Router()
const { isUserExist, createNewUser } = require('../../controller/users')

route.post('/', async (req, res) => {



    let check = await isUserExist(req.body.user.username);
    if (check) {

        if (check.error) {
            res.send({
                error: "unable to create new user (server error)"
            })
        }

        else {
            res.send({
                error: "User already exists"
            })
        }
    }

    else {
        if (req.body.user) {

            let newUser = await createNewUser(req.body.user);



            if (newUser) {

                console.log("New User Created")

                res.send({
                    user: {
                        username: newUser.user.username,
                        token: newUser.user.token
                    }
                })
            }

            else {

                res.send({
                    error: "Unable to register Please try again "
                })
            }



        }
    }

})


module.exports = { route }
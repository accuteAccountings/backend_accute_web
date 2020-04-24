const route = require('express').Router()
const { Users } = require('../../db/db')
const { auth } = require('../../middleware/auth')

// login handler
route.post('/', (req, res) => {

    let cuser = req.body

    Users.findOne({
        where: {

            username: cuser.username

        }
    }).then((user) => {

        if (cuser.password === user.password) {

            req.session.token = user.token
            req.session.save()

            res.send({ username: user.username })
        }

        else {
            res.send({ error: "Password is incorrect" })
        }


    })
        .catch((err) => {
            console.log("login error :-" + err)
            res.send({ error: "username not found" })
        })




})


route.get('/', auth, (req, res) => {
    res.send({ username: req.user.username })
})

route.delete('/', auth, (req, res) => {
    req.session.token = null
    req.session.save()
    res.redirect('/home')
})









module.exports = { route }
const route = require('express').Router()
const { passport } = require('../../middleware/passport');

route.post('/', passport.authenticate('local', {
    failureRedirect: '/home'
}), (req, res) => {

    let username = req.user.username
    res.send({ username })
})




module.exports = { route }
const route = require('express').Router()

route.get('/', (req, res) => {

    res.send("login")
})


module.exports = { route }
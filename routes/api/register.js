const route = require('express').Router()

route.get('/', (req, res) => {

    res.send("register ")
})


module.exports = { route }
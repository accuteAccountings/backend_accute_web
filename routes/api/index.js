const route = require('express').Router()

route.use('/register', require('./register').route)
route.use('/login', require('./login').route)

module.exports = { route }
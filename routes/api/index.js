const route = require('express').Router()

route.use('/register', require('./register').route)

module.exports = { route }
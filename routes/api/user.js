const {Router} = require('express')
const route = Router()
const {Users} = require('../../db/db')

route.get('/' , async(req,res) => {
    const users = await Users.findAll()

    res.send(users)
})

module.exports = {route}
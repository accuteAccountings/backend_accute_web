const {Router} = require('express')
const route = Router()
const {Users} = require('../../db/db')

route.get('/' , async(req,res) => {
    const users = await Users.findAll({
        attributes : ['id' , 'full_name' , 'email' , 'phone_num' , 'pro_img']
    })

    res.send(users)
})

module.exports = {route}
const {Router} = require('express')
const route = Router()
const {Users} = require('../../db/db')
const {auth} = require('../../middleware/auth')
const accounts = require('./accounts')

route.get('/' , async(req,res) => {
    const users = await Users.findAll({
        attributes : ['id' , 'full_name' , 'email' , 'phone_num' , 'pro_img' , 'createdAt']
    })

    res.send(users)
})

route.put('/edit' , auth , async(req,res) => {
    try {
    const user = await Users.findOne({
        where : {id : req.user.id},
        attributes : ['id' , 'username' , 'full_name' , 'email'
    , 'phone_num' , 'pro_img' , 'address' , 'gender' , 'gst_num'
    , 'age' , 'createdAt']
    })
    let a = req.body;
    user.update({...a})
    res.send(user);
    } catch (error) {
        console.log(error);
        res.send({error : error.message})
    }
})

route.put('/suspend' , async(req,res) => {
    try {
        const user = await Users.findOne({
            where : {id : req.query.id}
        })
    
        user.suspended = true
        user.save()
    
        res.send(true)
    } catch (error) {
        res.send(error.message)
    }
   
})

route.get('/specific' , async(req,res) => {
    try {
        const user = await Users.findOne({
            where : {id : req.query.id}
        })
        console.log('aya idgar haan')
        res.send(user)
    } catch (error) {
        console.log(error)
        res.send({error : error.message})
    }
})

module.exports = {route}
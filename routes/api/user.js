const {Router} = require('express')
const route = Router()
const {Users} = require('../../db/db')
const {auth} = require('../../middleware/auth')

route.get('/' , async(req,res) => {
    const users = await Users.findAll({
        attributes : ['id' , 'full_name' , 'email' , 'phone_num' , 'pro_img' , 'createdAt']
    })

    res.send(users)
})

route.put('/edit' , auth , async(req,res) => {
    try {
        const user = req.user;
    let a = req.body;

    if(a.username){
        user.username = a.username;
        user.save();
    }
    if(a.address){
        user.address = a.address;
        user.save();
    }
    if(a.gender){
        user.gender = a.gender;
        user.save();
    }
    if(a.gst_num){
        user.gst_num = a.gst_num;
        user.save();
    }
    if(a.full_name){
        user.full_name = a.full_name;
        user.save();
    }
    if(a.email){
        user.email = a.email;
        user.save();
    }
    if(a.phone_num){
        user.phone_num = a.phone_num;
        user.save();
    }
    if(a.occupation){
        user.occupation = a.occupation;
        user.save();
    }
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
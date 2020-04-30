const route = require('express').Router()
const {Products} = require('../../db/db')
const {auth} = require('../../middleware/auth')

route.post('/' , auth , (req ,res)=>{

    const prod = Products.create({

        UserId : req.user.id,
        product_name: req.body.product_name,
        hsn_num: req.body.hsn_num


    }).then((p)=>{

        res.send({product:p})
    })
    .catch((err) => {
        console.log(err)
        res.send({error:err})

    })






})

route.get('/' , auth , (req ,res )=>{

    let allUserPro = Products.findAll({

        where:{
            UserId : req.user.id
        }
    })
    .then((p)=>{
        res.send({
            Products:p
        })
    })
    .catch((err)=>{
        console.log(err)
        res.send({
            error:err
        })
    })



})





module.exports = {route}

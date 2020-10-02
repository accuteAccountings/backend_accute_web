const {Users} = require('../db/db')

async function IsSuspended(req,res,next){
    try {
        const user = await Users.findOne({
            where : {token : req.user.token}
        })
        console.log(user + "this is is it")

        if(user.suspended){
            res.status("401").send({error:"Suspended"})
            throw new Error('User is Suspended')
        }else{
            next();
        }
    } catch (error) {
console.error(error)
        return error
    }
   
}

module.exports = {IsSuspended}

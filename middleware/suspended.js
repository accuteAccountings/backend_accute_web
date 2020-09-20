const {Users} = require('../db/db')

async function IsSuspended(next){
    try {
        const user = await Users.findOne({
            where : {token : require.session.token}
        })
        console.log(user.username)

        if(user.suspended){
            throw new Error('User is Suspended')
        }else{
            next();
        }
    } catch (error) {
        return error
    }
   
}

module.exports = {IsSuspended}
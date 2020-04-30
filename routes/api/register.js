const route = require('express').Router()
const { isUserExist,isUserExistEmail, createNewUser,createNewUserGoogle } = require('../../controller/users')

route.post('/', async (req, res) => {



    let check = await isUserExist(req.body.user.username);
    if (check) {

        if (check.error) {
            res.send({
                error: "unable to create new user (server error)"
            })
        }

        else {
            res.send({
                error: "User already exists"
            })
        }
    }

    else {
        if (req.body.user) {

            let newUser = await createNewUser(req.body.user);



            if (newUser.user.username) {

                console.log("New User Created")

                res.send({
                    user: {
                        username: newUser.user.username,
                        token: newUser.user.token
                    }
                })
            }

            else {

                res.send({
                    error: "Unable to register Please try again "
                })
            }



        }
    }

})



const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("462910295856-fjou78vc3gmfnhjgtvplk4vv5bvalrmj.apps.googleusercontent.com");

route.post('/google' ,async (req ,res )=>{

    let user = null

    console.log(req.body)
   
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.body.tokenId,
            audience: "462910295856-fjou78vc3gmfnhjgtvplk4vv5bvalrmj.apps.googleusercontent.com" 
        });
        const payload = ticket.getPayload();
        
        user = {
            email:payload.email,
            name : payload.name,
            pro_pic:payload.picture,
        
        }
        
      
        
      }
     await verify().catch((error)=> {console.log(error)
        res.send({error:"google auth error"})
    });
        
    if(user){
   let exist = await isUserExistEmail(user.email)

   if(!(exist=== false) && !(exist.error)){

    
    req.session.token = exist.token
    req.session.save()

    
    res.send({email:user.email})




   }
   else if(exist ===false){

    let newUser = await createNewUserGoogle(user)


    if(newUser.user.email){

        req.session.token = newUser.user.token
    req.session.save()

        res.send({
            email:newUser.user.email
            
        })
    }
    else {
        res.send({error:"internal error"})
    }

   }


   else {

    console.log("error")
    res.send("error")
   }

  


   

}

else {
    res.send("no")
}
       


})

module.exports = { route }
const route = require("express").Router();
const { Users } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const nodemailer = require('nodemailer')
const {getrandomnum} = require('../../utils/token_gen')

// login handler
route.post("/", (req, res) => {
  let cuser = req.body;

  Users.findOne({
    where: {
      email: cuser.email
    }
  })
    .then(user => {
      if (cuser.password === user.password) {
        req.session.token = user.token;
        req.session.save();

        res.status(200).send({ user: {username: user.username , pro_img:user.pro_img  , full_name:user.full_name}});
      } else {
        res.status(401).send({ error: "Password is incorrect" });
      }
    })
    .catch(err => {
      console.error("login error :-" + err);
      res.status(404).send({ error: "username not found" });
    });
});

route.get("/", auth, (req, res) => {
  res.status(200).send({ username: req.user.username });
});

route.delete("/", auth, (req, res) => {
  req.session.token = null;
  req.session.save();
  res.status(200).redirect("/home");
});

route.post('/ForgotPassword', async(req,res) => {

  try{
  const otp = await getrandomnum(5)
    
      let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'puranibooks123@gmail.com', 
        pass: 'classmate123.', 
      },
    });
  
    let info = await transporter.sendMail({
      from: 'Accute Accountings <no-reply@accute.live>', 
      to: `${req.body.email}`, 
      subject: "Reset your password", 
      text: 'Enter this otp to restore your Password', 
      html: `<div>
                <p>You told us you'd forgotten your password.If you really have
                ,use below OTP to change your password</p>
                <div><b> <h2>${otp}</h2></b></div>
                <div><p>If you didn't mean to reset your password , then you can
                ignore this email; you password will not change.
             </div>`, 
    });
  
    console.log("Message sent: %s", info.messageId);
  
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  res.status(200).send(otp)
}catch(err){
  console.log(err)
  res.status(300).send({error : "error Occured"})
}
 
})

route.put('/' , async(req,res) => {
  const user = await Users.findOne({
    where : {email : req.body.email}
  })
  if(req.body.password){
  user.password = req.body.password
  user.save()
  }
  res.send(true)
})

module.exports = { route };

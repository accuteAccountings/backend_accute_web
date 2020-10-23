const route = require("express").Router();
const { auth } = require("../../middleware/auth");
const { Users } = require("../../db/db");

route.get("/img", auth, (req, res) => {
  res.status(200).send({ pro_img: req.user.pro_img });
});

route.get("/name", auth, (req, res) => {
  res.status(200).send({ name: req.user.full_name });
});

route.get("/details" , auth ,async (req,res) =>{

try{

let UsersDetails = await Users.findOne({
where:{
id:req.user.id
},
})

console.log("Users" + UsersDetails)

res.status(200).send(UsersDetails)

}
catch(err){
console.error(err)
res.status(401).send({error:"Internal Error"})
}


})

route.post("/img", auth, (req, res) => {
  req.user.pro_img = req.body.pro_img;
  Users.save();
  res.status(201).send({ pro_img: req.user.pro_img });
});

module.exports = { route };

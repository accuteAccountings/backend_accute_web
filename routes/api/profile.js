const route = require("express").Router();
const { auth } = require("../../middleware/auth");
const { Users } = require("../../db/db");

route.get("/img", auth, (req, res) => {
  res.status(200).send({ pro_img: req.user.pro_img });
});

route.get("/name", auth, (req, res) => {
  res.status(200).send({ name: req.user.full_name });
});

route.post("/img", auth, (req, res) => {
  req.user.pro_img = req.body.pro_img;
  Users.save();
  res.status(201).send({ pro_img: req.user.pro_img });
});

module.exports = { route };

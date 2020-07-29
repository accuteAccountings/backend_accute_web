const route = require("express").Router();
const { Users } = require("../../db/db");
const { auth } = require("../../middleware/auth");

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

        res.status(200).send({ username: user.username });
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

module.exports = { route };

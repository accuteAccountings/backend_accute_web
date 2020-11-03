const route = require("express").Router();
const { Accounts } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const { getUserByUsername } = require("../../controller/users");
const { token_gen } = require("../../utils/token_gen")

route.post("/", auth ,  (req, res) => {
  try {
    let {
      acc_real_name,
      print_name,
      acc_type,
      status,
      gst_num,
      pan_num,
      aadhar_num,
      address_line1,
      address_line2,
      state,
      city,
      pincode,
      mob_num,
      phone_num,
      emailId,
      notes,
      bal
    } = req.body;

acc_name=token_gen(10);


    let newAcc = Accounts.create({
      acc_name,
      acc_real_name,
      print_name,
      acc_type,
      status,
      gst_num,
      pan_num,
      aadhar_num,
      address_line1,
      address_line2,
      state,
      city,
      pincode,
      mob_num,
      phone_num,
      emailId,

      notes,
      bal,

      UserId: req.user.id
    })
      .then(acc => {
        res.status(201).send({ account: { id: acc.id } });
      })
      .catch(err => {
        res.status(500).send({ error: err });
      });
  } catch (err) {
    console.log("At accounts Post req" + err);

    res.status(500).send({ error: "Internal Error" });
  }
});

route.put('/edit' , auth , async(req,res) => {
  try {
    let acc = await Accounts.findOne({
      where : {
        id : req.query.id
      }
    })
    let a = req.body;
    acc.update({...a})
   res.send(acc)
  } catch (error) {
    console.log(error);
    res.send({error : error.message})
  }
})

route.get("/", auth, (req, res) => {
  try {
    let accounts = Accounts.findAll({
      where: {
        UserId: req.user.id
      },
      order: [["createdAt", "ASC"]]
    })
      .then(acc => {
        if (req.query.mode == "oldest") {
          acc = acc.sort(function (a, b) {
            return a.createdAt - b.createdAt;
          });
        } else if (req.query.mode == "newest") {
          acc = acc.sort(function (a, b) {
            return b.createdAt - a.createdAt;
          });
        }

        res.send({ accounts: acc });
      })
      .catch(err => {
        res.send({ error: err });
      });
  } catch (err) {
    console.log("**** At get accounts routes" + err);
    res.status(500).send({ error: "Internal Error" });
  }
});

route.get("/getUser/:username", auth, async (req, res) => {
  console.log("aagagdsaaa aaaa " + req.params.username);
  try {
    let username = req.params.username;
    let userInfo = await getUserByUsername(username);
console.log(userInfo)

    if (userInfo) {
      res.send(userInfo);
    } else {
      res.status(404).send({ error: "User Not Found" });
    }
  } catch (err) {
    res.status(500).send({ error: "internal Error" });
  }
});

route.delete("/:id", auth,   (req, res) => {
  try {
    let id = req.params.id;

    Accounts.destroy({
      where: {
        UserId: req.user.id,
        id
      }
    })
      .then(() => {
        console.log("deleted Product");

        res.send({
          deleted: `Accuont${id}`
        });
      })
      .catch(err => {
        console.log(err);
        res.send({
          error: err
        });
      });
  } catch (err) {
    throw new Error("At delete account routes :- " + err);
    res.status(500).send({ error: "Internal Error" });
  }
});

route.put("/", auth,   (req, res) => {
  try {
    const prod = Accounts.findOne({
      where: {
        UserId: req.user.id,
        id: req.body.id
      }
    })
      .then(acc => {
        let u = req.body;

        acc.acc_real_name = u.acc_real_name;

        acc.print_name = u.print_name;

        acc.acc_type = u.acc_type;

        acc.status = u.status;

        acc.gst_num = u.gst_num;

        acc.pan_num = u.pan_num;

        acc.aadhar_num = u.aadhar_num;

        acc.address_line1 = u.address_line1;
        acc.address_line2 = u.address_line2;
        acc.state = u.state;

        acc.city = u.city;

        acc.pincode = u.pincode;

        acc.mob_num = u.mob_num;

        acc.phone_num = u.phone_num;

        acc.emailId = u.emailId;

        acc.notes = u.notes;

        acc.bal = u.bal;

        acc
          .save()
          .then(() => {
            res.send({ account: { id: acc.id } });
          })
          .catch(err => {
            console.log(err);

            res.send({ error: err });
          });
      })
      .catch(err => {
        console.log(err);
        res.send({ error: err });
      });
  } catch (err) {
    throw new Error("At put account routes :- " + err);
    res.status(500).send({ error: "Internal Error" });
  }
});

route.get('/specific' , auth , async(req,res) => {
  console.log("aa ti hjhhhhhhhkj hhh" + req.query.id)
  let acc = await Accounts.findOne({
    where : {
      id : req.query.id  
      }
  })

  res.send(acc);
})

module.exports = { route };

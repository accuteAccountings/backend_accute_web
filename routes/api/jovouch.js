const { JoVouch } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const route = require("express").Router();
const seq = require("sequelize");

route.post("/", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  console.log(v);
  console.log(v.payArr);
  console.log(v.payArr.amt);
  let Spay = v.payArr.map(e => {
    let s = " " + e.mode + ":" + e.det + ":" + e.amt;
    return s;
  });
  try {
    let NewJoVouch = await JoVouch.create({
      UserId: user,
      bill_date: v.bill_date,
      type: v.type,
      credit_acc: v.credit_acc,
      debit_acc: v.debit_acc,
      payArr: Spay,
      billArr: v.billArr,
      amount: v.amount,
      balance: v.balance
    });
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(300).send({ error: "unable to add JoVouchers" });
  }
});

route.delete("/:id", auth, async (req, res) => {
  try {
    let jovouch = await JoVouch.findOne({
      where: {
        [seq.Op.and]: [{ UserId: req.user.id }, { id: req.params.id }]
      }
    });

    jovouch.destroy();
    res.send({ deleted: "jovouch" + req.params.id });
  } catch (err) {
    console.error(err);
    res.send({ error: "internal error" });
  }
});

route.put("/:id", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  let Spay = v.payArr.map(e => {
    let s = " " + e.mode + ":" + e.det + ":" + e.amt;
    return s;
  });
  try {
    let jovouch = await JoVouch.findOne({
      where: {
        [seq.Op.and]: [{ UserId: user }, { id: req.params.id }]
      }
    });

    let NewJoVouch = {
      UserId: user,
      bill_date: v.bill_date,
      type: v.type,
      credit_acc: v.credit_acc,
      debit_acc: v.debit_acc,
      payArr: Spay,
      billArr: v.billArr,
      amount: v.amount,
      balance: v.balance
    };

    await jovouch.update(NewJoVouch);

    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(300).send({ error: "unable to add JoVouchers" });
  }
});

route.get("/", auth, async (req, res) => {
  try {
    let JoVouchers = await JoVouch.findAll({
      where: {
        UserId: req.user.id
      }
    });

    let resData = JoVouchers.map(Jo => {
      let obj = [];
      Jo.payArr.map(e => {
        let arr = e.split(":");

        let o = {
          mode: arr[0],
          det: arr[1],
          amt: arr[2]
        };
        let a = JSON.stringify(o);
        obj.push(a);
      });
      Jo.payArr = obj;
      return Jo;
    });

    res.send(resData);
  } catch (err) {
    console.log("error from jovouch " + err);
    res.send({ error: "internal Error" });
  }
});
module.exports = { route };

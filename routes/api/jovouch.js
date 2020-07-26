const { Vouch, JoVouch, Accounts } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const route = require("express").Router();
const seq = require("sequelize");

route.post("/", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

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

    let payAm = parseInt(NewJoVouch.amount) - parseInt(NewJoVouch.balance);

    NewJoVouch.billArr.map(async e => {
      let vouch = await Vouch.findOne({
        where: {
          [seq.Op.and]: [{ UserId: user }, { bill_num: e }]
        }
      });
      let a = parseInt(payAm) - parseInt(vouch.totalAmt);
      if (a >= 0) {
        vouch.status = 0;
        vouch.save();
        payAm = parseInt(payAm) - parseInt(vouch.totalAmt);
      } else if (a < 0) {
        vouch.status = a;
        vouch.save();
        payAm = 0;
      }
    });
    let cre_acc = await Accounts.findOne({
      where: { acc_name: NewJoVouch.credit_acc }
    });

    cre_acc.Balance = parseFloat(cre_acc.Balance) + (parseFloat(NewJoVouch.amount) - parseFloat(NewJoVouch.balance));
    console.log(cre_acc.Balance);
    cre_acc.save();

    NewJoVouch.Bal_left_credit = cre_acc.Balance;
    NewJoVouch.save();

    let deb_acc = await Accounts.findOne({
      where: { acc_name: NewJoVouch.debit_acc }
    });

    deb_acc.Balance = parseFloat(deb_acc.Balance) - (parseFloat(NewJoVouch.amount) - parseFloat(NewJoVouch.balance));
    deb_acc.save();

    NewJoVouch.Bal_left_debit = deb_acc.Balance;
    NewJoVouch.save();

    res.status(201).send(true);
  } catch (err) {
    console.error("*** At post jo vouch :-  " + err);
    res.status(500).send({ error: "unable to add JoVouchers" });
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
    res.status(201).send({ deleted: "jovouch" + req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "internal error" });
  }
});

route.put("/:id", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;
  console.log(v);

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

    let payAm = parseInt(NewJoVouch.amount) - parseInt(NewJoVouch.balance);

    NewJoVouch.billArr.map(async e => {
      let vouch = await Vouch.findOne({
        where: {
          [seq.Op.and]: [{ UserId: user }, { bill_num: e }]
        }
      });
      let a = parseInt(payAm) - parseInt(vouch.totalAmt);

      if (a >= 0) {
        vouch.status = 0;
        vouch.save();
        payAm = parseInt(payAm) - parseInt(vouch.totalAmt);
      } else if (a < 0) {
        vouch.status = a;
        vouch.save();
        payAm = 0;
      }
    });
    await jovouch.update(NewJoVouch);

    res.status(201).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "unable to add JoVouchers" });
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

    res.status(200).send(resData);
  } catch (err) {
    console.error("error from jovouch " + err);
    res.status(500).send({ error: "internal Error" });
  }
});

route.get("/printedBill/:bill_num", auth, async (req, res) => {
  let arr = req.params.bill_num.split(",");
  console.log(arr + "hiiiii");
  try {
    const jo_details = await JoVouch.findOne({
      where: {
        billArr: arr.join(";")
      }
    });
    if (arr.length > 1) {
      let details = [];
      for (let i = 0; i < arr.length; i++) {
        const jo_det = await Vouch.findOne({
          where: {
            bill_num: arr[i]
          }
        });
        if (jo_det) {
          details.push(jo_det);
        }
      }

      res.status(200).send({ jovouch: jo_details, provouch: details });
    } else {
      res.status(200).send({ jovouch: jo_details, provouch: [] });
    }
  } catch (err) {
    throw new Error(err);
    res.status(500).send({ error: "Internal Error" });
  }
});

module.exports = { route };

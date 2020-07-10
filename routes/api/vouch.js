const { Vouch, Vouch_pro, Accounts, JoVouch } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const route = require("express").Router();
const seq = require("sequelize");

route.post("/", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  try {
    let acc = await Accounts.findOne({
      where: { acc_name: v.supplier }
    });

    let costumer = await Accounts.findOne({
      where: { acc_name: v.customer }
    });

    let NewVouch = await Vouch.create({
      UserId: user,
      bill_date: v.bill_date,
      type: v.type,
      bill_num: v.bill_num,
      g_r_num: v.g_r_num,
      transport_name: v.transport_name,
      supplier: v.supplier,
      supplier_agent: v.supplier_agent,
      supplier_agent2: v.supplier_agent2,
      discount: v.discount,
      set_commission: v.set_commission,
      customer: v.customer,
      totalAmt: v.totalAmt,
      status: "UNPAID"
    });
    let UpItems = await v.items.map(e => {
      Vouch_pro.create({
        VouchId: NewVouch.id,
        product_name: e.product_name,
        quantity: e.quantity,
        gst: e.gst,
        rate: e.rate,
        hsn_num: e.hsn_num
      });
    });

    acc.Balance = parseFloat(acc.Balance) - parseFloat(NewVouch.totalAmt);
    acc.save();

    NewVouch.Bal_left_supplier = acc.Balance;
    NewVouch.save();
    // this.handleModal()

    costumer.Balance = parseFloat(costumer.Balance) + parseFloat(NewVouch.totalAmt);
    costumer.save();

    NewVouch.Bal_left_costumer = costumer.Balance;
    NewVouch.save();

    res.status(200).send(true);
    // let NewVouch_pro = await Vouch_pro.bulkCreate(UpItems);
  } catch (err) {
    console.log(err);
    res.status(300).send({ error: "unable to add Vouchers" });
  }
});

route.get("/", auth, async (req, res) => {
  let resArr = [];
  try {
    let Vouchers = await Vouch.findAll({
      where: {
        UserId: req.user.id
      }
    });

    for (let i = 0; i < Vouchers.length; i++) {
      let items = await Vouch_pro.findAll({
        where: {
          VouchId: Vouchers[i].id
        }
      });
      console.log("inn");

      let det = Vouchers[i];
      let product = items;
      let resData = { det: det, product: product };
      resArr.push(resData);
    }

    console.log("now");
    res.send(resArr);
  } catch (err) {
    console.log("error from vouch " + err);
    res.send({ error: "internal Error" });
  }
});

route.get("/specific/:supplier", auth, async (req, res) => {
  console.log(req.params.supplier + "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii" + req.query.particulars + req.query.sdate);
  if (req.query.sdate && req.query.edate && req.query.particulars && req.query.agent) {
    const rec = await Vouch.findAll({
      where: {
        [seq.Op.and]: [
          {
            [seq.Op.or]: [
              { [seq.Op.and]: [{ supplier: req.params.supplier }, { customer: req.query.particulars }] },
              { [seq.Op.and]: [{ customer: req.params.supplier }, { supplier: req.query.particulars }] }
            ]
          },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } },
          { supplier_agent: req.query.agent }
        ]
      }
    });

    const recJO = await JoVouch.findAll({
      where: {
        [seq.Op.and]: [
          {
            [seq.Op.or]: [
              { [seq.Op.and]: [{ credit_acc: req.params.supplier }, { debit_acc: req.query.particulars }] },
              { [seq.Op.and]: [{ debit_acc: req.params.supplier }, { credit_acc: req.query.particulars }] }
            ]
          },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } }
        ]
      }
    });
    var arr = rec.concat(recJO);

    arr = arr.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    console.log("in the if");
  } else if (req.query.sdate && req.query.edate && req.query.particulars) {
    const rec = await Vouch.findAll({
      where: {
        [seq.Op.and]: [
          {
            [seq.Op.or]: [
              { [seq.Op.and]: [{ supplier: req.params.supplier }, { customer: req.query.particulars }] },
              { [seq.Op.and]: [{ customer: req.params.supplier }, { supplier: req.query.particulars }] }
            ]
          },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } }
        ]
      }
    });

    const recJO = await JoVouch.findAll({
      where: {
        [seq.Op.and]: [
          {
            [seq.Op.or]: [
              { [seq.Op.and]: [{ credit_acc: req.params.supplier }, { debit_acc: req.query.particulars }] },
              { [seq.Op.and]: [{ debit_acc: req.params.supplier }, { credit_acc: req.query.particulars }] }
            ]
          },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } }
        ]
      }
    });
    var arr = rec.concat(recJO);

    arr = arr.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    console.log("in the if");
  } else if (req.query.sdate && req.query.edate && req.query.agent) {
    const rec = await Vouch.findAll({
      where: {
        [seq.Op.and]: [
          { [seq.Op.or]: [{ supplier: req.params.supplier }, { customer: req.params.supplier }] },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } },
          { supplier_agent: req.query.agent }
        ]
      }
    });

    const recJO = await JoVouch.findAll({
      where: {
        [seq.Op.and]: [
          { [seq.Op.or]: [{ credit_acc: req.params.supplier }, { debit_acc: req.params.supplier }] },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } }
        ]
      }
    });
    var arr = rec.concat(recJO);

    arr = arr.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    console.log("in the if");
  } else if (req.query.sdate && req.query.edate) {
    const rec = await Vouch.findAll({
      where: {
        [seq.Op.and]: [
          { [seq.Op.or]: [{ supplier: req.params.supplier }, { customer: req.params.supplier }] },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } }
        ]
      }
    });

    const recJO = await JoVouch.findAll({
      where: {
        [seq.Op.and]: [
          { [seq.Op.or]: [{ credit_acc: req.params.supplier }, { debit_acc: req.params.supplier }] },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } }
        ]
      }
    });
    var arr = rec.concat(recJO);

    arr = arr.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    console.log("in the date only");
  } else if (req.query.agent) {
    const rec = await Vouch.findAll({
      where: { supplier_agent: req.query.agent }
    });

    var arr = rec;

    arr = arr.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    console.log("in the if");
  } else {
    const rec = await Vouch.findAll({
      where: {
        [seq.Op.or]: [
          { [seq.Op.and]: [{ supplier: req.params.supplier }, { customer: req.query.particulars }] },
          { [seq.Op.and]: [{ customer: req.params.supplier }, { supplier: req.query.particulars }] }
        ]
      }
    });

    const recJO = await JoVouch.findAll({
      where: {
        [seq.Op.or]: [
          { [seq.Op.and]: [{ credit_acc: req.params.supplier }, { debit_acc: req.query.particulars }] },
          { [seq.Op.and]: [{ debit_acc: req.params.supplier }, { credit_acc: req.query.particulars }] }
        ]
      }
    });

    var arr = rec.concat(recJO);

    arr = arr.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    console.log("in the else");
  }

  console.log(arr.length);
  res.send(arr);
});

route.get("/recent/:supplier", auth, async (req, res) => {
  const rec = await Vouch.findAll({
    where: {
      [seq.Op.and]: [{ [seq.Op.or]: [{ supplier: req.params.supplier }, { customer: req.params.supplier }] }]
    }
  });

  const recJO = await JoVouch.findAll({
    where: {
      [seq.Op.and]: [{ [seq.Op.or]: [{ credit_acc: req.params.supplier }, { debit_acc: req.params.supplier }] }]
    }
  });
  let arr = rec.concat(recJO);

  arr = arr.sort(function (a, b) {
    return a.createdAt - b.createdAt;
  });

  console.log();
  res.send(arr);
});

route.put("/:id", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  try {
    let acc = await Accounts.findOne({
      where: { acc_name: v.supplier }
    });

    let NewVouch = await Vouch.findOne({
      where: {
        [seq.Op.and]: [{ UserId: user }, { id: req.params.id }]
      }
    });

    let New = {
      bill_date: v.bill_date,
      type: v.type,
      bill_num: v.bill_num,
      g_r_num: v.g_r_num,
      transport_name: v.transport_name,
      supplier: v.supplier,
      supplier_agent: v.supplier_agent,
      supplier_agent2: v.supplier_agent2,
      discount: v.discount,
      set_commission: v.set_commission,
      customer: v.customer,
      totalAmt: v.totalAmt
    };

    let up = await NewVouch.update(New);

    Vouch_pro.destroy({ where: { VouchId: up.id } });

    let UpItems = await v.items.map(e => {
      Vouch_pro.create({
        VouchId: up.id,
        product_name: e.product_name,
        quantity: e.quantity,
        gst: e.gst,
        rate: e.rate,
        hsn_num: e.hsn_num
      });
    });

    if (NewVouch.type == "Credit") {
      NewVouch.Bal_left = parseFloat(acc.bal) + parseFloat(NewVouch.totalAmt);
      NewVouch.save();

      acc.bal = parseFloat(acc.bal) + parseFloat(NewVouch.totalAmt);
      acc.save();
    }

    if (NewVouch.type == "Debit") {
      NewVouch.Bal_left = parseFloat(acc.bal) - parseFloat(NewVouch.totalAmt);
      NewVouch.save();

      acc.bal = parseFloat(acc.bal) - parseFloat(NewVouch.totalAmt);
      acc.save();
    }

    res.status(200).send(true);
    // let NewVouch_pro = await Vouch_pro.bulkCreate(UpItems);
  } catch (err) {
    console.log(err);
    res.status(300).send({ error: "unable to add Vouchers" });
  }
});

route.delete("/:id", auth, async (req, res) => {
  try {
    let vouch = await Vouch.findOne({
      where: {
        id: req.params.id
      }
    });
    if (vouch.UserId === req.user.id) {
      console.log(vouch);
      vouch.destroy();
      res.send({ deleted: "vouch" + req.params.id });
    } else {
      res.send({ error: "not authorized" });
    }
  } catch (err) {
    console.error(err);
    res.send({ error: "internal Error" });
  }
});

module.exports = { route };

const { Vouch, Vouch_pro, Accounts, JoVouch } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const route = require("express").Router();
const seq = require("sequelize");
const { Sequelize } = require("sequelize");
const { IsSuspended } = require("../../middleware/suspended");
// const { parse } = require("dotenv/types");

route.post("/", auth, async (req, res) => {
  if (process.env.apiLogs == "true") {
    console.log("[post]/api/jovouch");
  }
  if (process.env.apiBodyData == "true") {
    console.log("[post Data]");
    console.log(req.body);
  }
  let v = req.body;
  let user = req.user.id;
  let discountArr = v.discountArr.map((e) => {
    let s = e.type + ":" + e.value;
    return s;
  });
  let freightArr = v.freightArr.map((e) => {
    let s = e.remark + ":" + e.value;

    return s;
  });

  try {
    let acc = await Accounts.findOne({
      where: { id: v.supplier_id },
    });

    let costumer = await Accounts.findOne({
      where: { id: v.customer_id },
    });
    console.log(v);
    console.log(acc);
    console.log(costumer);

    let NewVouch = await Vouch.create({
      UserId: user,
      bill_date: v.bill_date,
      type: v.type,
      bill_num: v.bill_num,
      g_r_num: v.g_r_num,
      transport_name: v.transport_name,
      supplier: v.supplier,
      supplier_id: v.supplier_id,
      supplier_agent: v.supplier_agent,
      supplier_agent2: v.supplier_agent2,
      gst: v.gst,
      set_commission: v.set_commission,
      customer: v.customer,
      customer_id: v.customer_id,
      totalAmt: v.totalAmt,
      discountArr: discountArr,
      freightArr: freightArr,
      status: "-" + v.totalAmt,
    });
    let UpItems = await v.items.map((e) => {
      Vouch_pro.create({
        VouchId: NewVouch.id,
        product_name: e.product_name,
        quantity: e.quantity,
        dicon: e.dicon,
        rate: e.rate,
        amount: e.amount,
        g_amount: e.g_amount,
        hsn_num: e.hsn_num,
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
    console.error(err);
    res.status(300).send({ error: "unable to add Vouchers" });
  }
});

route.get("/", auth, async (req, res) => {
  let resArr = [];
  try {
    let Vouchers = await Vouch.findAll({
      where: {
        [Sequelize.Op.and]: [{ UserId: req.user.id }, { IsDeleted: false }],
      },
    });
    if (!Vouchers) {
      res.send({});
      return;
    }

    let resData = Vouchers.map((Vo) => {
      let obj1 = [];
      let obj2 = [];
      Vo.discountArr.map((e) => {
        let arr = e.split(":");

        let o = {
          type: arr[0],
          value: arr[1],
        };
        let a = JSON.stringify(o);
        obj1.push(a);
      });
      Vo.freightArr.map((e) => {
        let arr = e.split(":");

        let o = {
          remark: arr[0],
          value: arr[1],
        };
        let a = JSON.stringify(o);
        obj2.push(a);
      });
      Vo.discountArr = obj1;
      Vo.freightArr = obj2;
      return Vo;
    });

    for (let i = 0; i < Vouchers.length; i++) {
      let items = await Vouch_pro.findAll({
        where: {
          VouchId: Vouchers[i].id,
        },
      });

      let det = Vouchers[i];
      let product = items;
      let resData = { det: det, product: product };
      resArr.push(resData);
    }

    if (req.query.mode == "oldest") {
      resArr = resArr.sort(function (a, b) {
        return a.det.createdAt - b.det.createdAt;
      });
    } else if (req.query.mode == "newest") {
      resArr = resArr.sort(function (a, b) {
        return b.det.createdAt - a.det.createdAt;
      });
    }

    if (req.query.dir == "low") {
      resArr = resArr.sort(function (a, b) {
        return a.det.totalAmt - b.det.totalAmt;
      });
    } else if (req.query.dir == "high") {
      resArr = resArr.sort(function (a, b) {
        return b.det.totalAmt - a.det.totalAmt;
      });
    }

    res.status(200).send(resArr);
  } catch (err) {
    console.error("error from vouch " + err);
    res.status(500).send({ error: "internal Error" });
  }
});

route.get("/specific/:supplier", auth, async (req, res) => {
  if (req.query.sdate && req.query.edate) {
    const rec = await Vouch.findAll({
      where: {
        [seq.Op.and]: [
          { [seq.Op.or]: [{ supplier: req.params.supplier }, { customer: req.params.supplier }] },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } },
          { IsDeleted: false },
        ],
      },
    });

    const recJO = await JoVouch.findAll({
      where: {
        [seq.Op.and]: [
          { [seq.Op.or]: [{ credit_acc: req.params.supplier }, { debit_acc: req.params.supplier }] },
          { bill_date: { [seq.Op.between]: [req.query.sdate, req.query.edate] } },
          { IsDeleted: false },
        ],
      },
    });
    var arr = rec.concat(recJO);

    if (req.query.mode == "date") {
      arr = arr.sort(function (a, b) {
        return a.createdAt - b.createdAt;
      });
    } else {
      arr = arr.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
    }

    res.status(200).send(arr);
  } else {
    const rec = await Vouch.findAll({
      where: {
        IsDeleted: false,
      },
    });

    const recJO = await JoVouch.findAll({
      where: {
        IsDeleted: false,
      },
    });

    var arr = rec.concat(recJO);
    res.send(arr);
  }
});

route.put("/:id", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  let discountArr = v.discountArr.map((e) => {
    let s = e.type + ":" + e.value;

    return s;
  });
  let freightArr = v.freightArr.map((e) => {
    let s = e.remark + ":" + e.value;

    return s;
  });

  try {
    let acc = await Accounts.findOne({
      where: { acc_name: v.supplier },
    });

    let NewVouch = await Vouch.findOne({
      where: {
        [seq.Op.and]: [{ UserId: user }, { id: req.params.id }],
      },
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
      gst: v.gst,
      set_commission: v.set_commission,
      discountArr,
      freightArr,
      customer: v.customer,
      totalAmt: v.totalAmt,
    };

    let up = await NewVouch.update(New);

    Vouch_pro.destroy({ where: { VouchId: up.id } });

    let UpItems = await v.items.map((e) => {
      Vouch_pro.create({
        VouchId: up.id,
        product_name: e.product_name,
        quantity: e.quantity,
        dicon: e.dicon,
        amount: e.amount,
        g_amount: e.g_amount,
        rate: e.rate,
        hsn_num: e.hsn_num,
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

    res.status(201).send(true);
    // let NewVouch_pro = await Vouch_pro.bulkCreate(UpItems);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "unable to add Vouchers" });
  }
});

route.delete("/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id);
    let vouch = await Vouch.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log("deletedddddddddd" + vouch.id);
    if (vouch.UserId === req.user.id) {
      vouch.IsDeleted = true;
      vouch.save();
      console.log("succesfully deleted");
      res.status(201).send({ deleted: "vouch" + req.params.id });
    } else {
      res.status(401).send({ error: "not authorized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "internal Error" });
  }
});
route.put("/res/:id", auth, async (req, res) => {
  try {
    let vouch = await Vouch.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (vouch.UserId === req.user.id) {
      vouch.IsDeleted = false;
      vouch.save();
      res.status(201).send({ restored: "vouch" + req.params.id });
    } else {
      res.status(401).send({ error: "not authorized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "internal Error" });
  }
});
route.delete("/permanent/:id", auth, async (req, res) => {
  try {
    let vouch = await Vouch.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (vouch.UserId === req.user.id) {
      vouch.destroy();
      res.status(201).send({ deleted: "vouch" + req.params.id });
    } else {
      res.status(401).send({ error: "not authorized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "internal Error" });
  }
});

route.get("/TotalSales", auth, async (req, res) => {
  let date = new Date();
  let year = date.getFullYear();
  let month = parseInt(date.getMonth()) + 1;

  if (parseInt(month) < 10) {
    month = "0" + month;
  }

  let arr = [];

  let start = "1";
  let end = "3";

  while (parseInt(end) < 32) {
    if (parseInt(start) < 10) {
      start = "0" + start;
    }
    if (parseInt(end) < 10) {
      end = "0" + end;
    }

    let sdate = year + "-" + month + "-" + start;
    let edate = year + "-" + month + "-" + end;

    const Sales = await Vouch.findAll({
      where: {
        [Sequelize.Op.and]: [{ UserId: req.user.id }, { bill_date: { [Sequelize.Op.between]: [sdate, edate] } }],
      },
    });

    arr.push(Sales);

    start = parseInt(start) + 3;
    end = parseInt(end) + 3;
    if (parseInt(end) == 30) {
      end = 31;
    }
  }
  res.send(arr);
});

route.get("/commission/vouches", auth, async (req, res) => {
  const rec = await Vouch.findAll({
    where: {
      [seq.Op.and]: [{ [seq.Op.or] :[{ supplier: req.query.supplier} , 
        {customer : req.query.supplier}]}
      , { IsDeleted: false }],
    },
  });

  res.send(rec);
});

module.exports = { route };

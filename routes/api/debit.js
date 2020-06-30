const { Debit, Debit_pro } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const route = require('express').Router();
 
route.post("/", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  try {
    let NewDebit = await Debit.create({
      UserId: user,
      bill_date: v.bill_date,
      type: v.type,
      bill_num: v.bill_num,
      g_r_num: v.g_r_num,
      transport_name: v.transport_name,
      supplier: v.supplier,
      supplier_agent: v.supplier_agent,
      set_commission: v.set_commission,
      customer: v.customer
    });
    let UpItems = await v.items.map(e => {
      Debit_pro.create({
        DebitId: NewDebit.id,
        product_name: e.product_name,
        quantity: e.quantity,
        gst: e.gst,
        rate: e.rate,
        hsn_num: e.hsn_num
      });
    });

    res.status(200).send(true);
    // let NewDebit_pro = await Debit_pro.bulkCreate(UpItems);
  } catch (err) {
    console.log(err);
    res.status(300).send({ error: "unable to add Debiters" });
  }
});

route.get("/", auth, async (req, res) => {
  let resArr = [];
  try {
    let Debiters = await Debit.findAll({
      where: {
        UserId: req.user.id
      }
    });
    console.log(Debiters);

    for (let i = 0; i < Debiters.length; i++) {
      let items = await Debit_pro.findAll({
        where: {
          DebitId: Debiters[i].id
        }
      });
      console.log("inn");

      let det = Debiters[i];
      let product = items;
      let resData = { det: det, product: product };
      resArr.push(resData);
    }

    console.log("now");
    res.send(resArr);
  } catch (err) {
    console.log("error from debit " + err);
    res.send({ error: "internal Error" });
  }
});
module.exports = { route };

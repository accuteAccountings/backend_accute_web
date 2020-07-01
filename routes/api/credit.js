const { Credit, Credit_pro } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const route = require("express").Router();

route.post("/", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  try {
    let NewCredit = await Credit.create({
      UserId: user,
      bill_date: v.bill_date,
      type: v.type,
      bill_num: v.bill_num,
      g_r_num: v.g_r_num,
      transport_name: v.transport_name,
      supplier: v.supplier,
      supplier_agent: v.supplier_agent,
      set_commission: v.set_commission,
      customer: v.customer,
      totalAmt:v.totalAmt
    });
    let UpItems = await v.items.map(e => {
      Credit_pro.create({
        CreditId: NewCredit.id,
        product_name: e.product_name,
        quantity: e.quantity,
        gst: e.gst,
        rate: e.rate,
        hsn_num: e.hsn_num
      });
    });

    res.status(200).send(true);
    // let NewCredit_pro = await Credit_pro.bulkCreate(UpItems);
  } catch (err) {
    console.log(err);
    res.status(300).send({ error: "unable to add Crediters" });
  }
});

route.get("/", auth, async (req, res) => {
  let resArr = [];
  try {
    let Crediters = await Credit.findAll({
      where: {
        UserId: req.user.id
      }
    });
    console.log(Crediters);

    for (let i = 0; i < Crediters.length; i++) {
      let items = await Credit_pro.findAll({
        where: {
          CreditId: Crediters[i].id
        }
      });
      console.log("inn");

      let det = Crediters[i];
      let product = items;
      let resData = { det: det, product: product };
      resArr.push(resData);
    }

    console.log("now");
    res.send(resArr);
  } catch (err) {
    console.log("error from credit " + err);
    res.send({ error: "internal Error" });
  }
});
module.exports = { route };

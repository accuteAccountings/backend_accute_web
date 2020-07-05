const { Vouch, Vouch_pro , Accounts} = require("../../db/db");
const { auth } = require("../../middleware/auth");
const route = require('express').Router();
const seq = require('sequelize')
 
route.post("/", auth, async (req, res) => {
  let v = req.body;
  let user = req.user.id;

  try {

    let acc = await Accounts.findOne({
      where : {acc_name : v.supplier}
    })

    let NewVouch = await Vouch.create({
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
      totalAmt:v.totalAmt,
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
  

	if(NewVouch.type == 'Credit'){

    NewVouch.Bal_left = parseFloat(acc.bal) + parseFloat(NewVouch.totalAmt)
    NewVouch.save()

    acc.bal = parseFloat(acc.bal) + parseFloat(NewVouch.totalAmt)
    acc.save()
    
  }
  
  if(NewVouch.type == 'Debit'){
    NewVouch.Bal_left = parseFloat(acc.bal) - parseFloat(NewVouch.totalAmt)
    NewVouch.save()

    acc.bal = parseFloat(acc.bal) - parseFloat(NewVouch.totalAmt)
    acc.save()
  }

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
    console.log(Vouchers);

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

route.get('/specific/:supplier/:date' , auth , async(req,res) => {
	console.log(req.params.date + 'hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
	const rec = await Vouch.findAll({
		where : {
      [seq.Op.and] : [
        {supplier : req.params.supplier},
        {bill_date : {[seq.Op.like] : `${req.params.date}%`}}
      ]
    }
	})
	console.log(req.params.supplier )
	res.send(rec)
})
module.exports = { route };

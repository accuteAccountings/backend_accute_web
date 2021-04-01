const { Router } = require("express");
const route = Router();
const { Vouch, JoVouch } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const seq = require("sequelize");

route.get("/sales", auth, async (req, res) => {
  try {
    var Det = [];

    var date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (parseInt(month) < 10) {
      month = "0" + month;
    }
    let startdate = 1;
    let enddate = 5;

    while (parseInt(enddate) < 32) {
      if (parseInt(startdate) < 10) {
        startdate = "0" + startdate;
      }
      if (parseInt(enddate) < 10) {
        enddate = "0" + enddate;
      }

      let sdate = year + "-" + month + "-" + startdate;
      let edate = year + "-" + month + "-" + enddate;

      const sales = await Vouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{ supplier: req.query.supplier }, { customer: req.query.supplier }] },
            { bill_date: { [seq.Op.between]: [sdate, edate] } }
          ]
        }
      });

      const recJO = await JoVouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{ credit_acc: req.query.supplier }, { debit_acc: req.query.supplier }] },
            { bill_date: { [seq.Op.between]: [sdate, edate] } }
          ]
        }
      });

      Det.push({ vouch: sales, jovouch: recJO });

      startdate = parseInt(startdate) + 5;
      enddate = parseInt(enddate) + 5;
    }

    res.status(200).send(Det);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Error" });
  }
});

route.get("/daywise", auth, async (req, res) => {
  try {
    let arr = [];
    var date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (parseInt(month) < 10) {
      month = "0" + month;
    }

    for (let i = 0; i < 10; i++) {
      let cdate = date.getDate() - parseInt(i);
      if (parseInt(cdate) < 10) {
        cdate = "0" + cdate;
      }
      var finaldate = year + "-" + month + "-" + cdate;

      const sales = await Vouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{ supplier: req.query.supplier }, { customer: req.query.supplier }] },
            { bill_date: { [seq.Op.like]: [`${finaldate}%`] } }
          ]
        }
      });

      const recJO = await JoVouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{ credit_acc: req.query.supplier }, { debit_acc: req.query.supplier }] },
            { bill_date: { [seq.Op.like]: [`${finaldate}%`] } }
          ]
        }
      });

      arr.push({ vouch: sales, jovouch: recJO });
    }
    res.status(200).send(arr);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Error" });
  }
});

route.get("/threeMonths", auth, async (req, res) => {
  try {
    let arr = [];
    var date = new Date();
    let year = date.getFullYear();

    for (let i = 2; i >= 0; i--) {
      let month = date.getMonth() - parseInt(i) + 1;
      if (parseInt(month) < 10) {
        month = "0" + month;
      }
      var sdate = year + "-" + month + "-" + "01";
      var edate = year + "-" + month + "-" + "14";

      for (let j = 0; j < 2; j++) {
        const sales = await Vouch.findAll({
          where: {
            [seq.Op.and]: [
              { [seq.Op.or]: [{ supplier: req.query.supplier }, { customer: req.query.supplier }] },
              { bill_date: { [seq.Op.between]: [sdate, edate] } }
            ]
          }
        });

        const recJO = await JoVouch.findAll({
          where: {
            [seq.Op.and]: [
              { [seq.Op.or]: [{ credit_acc: req.query.supplier }, { debit_acc: req.query.supplier }] },
              { bill_date: { [seq.Op.between]: [sdate, edate] } }
            ]
          }
        });

        arr.push({ vouch: sales, jovouch: recJO });

        sdate = year + "-" + month + "-" + "15";
        edate = year + "-" + month + "-" + "31";
      }
    }

    res.status(200).send(arr);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Error" });
  }
});

module.exports = { route };

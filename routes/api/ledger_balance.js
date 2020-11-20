const route = require("express").Router();
const {Vouch , JoVouch} = require('../../db/db')
const seq = require('sequelize')
const {auth} = require('../../middleware/auth')
const {Vouchers} = require('../../utils/vouchers')

route.get('/total' , auth ,  async(req,res) => {
    try {
        let arr = await Vouchers(req.query.supplier)
          let t =0;
          arr.map(e => {
            if (e.supplier === req.query.supplier) {
              t = parseInt(t) - parseInt(e.totalAmt);
            } 
            else if (e.debit_acc === req.query.supplier) {
              t = parseInt(t) - (parseInt(e.amount) - parseInt(e.balance));
            }
            else if (e.customer === req.query.supplier) {
                t = parseInt(t) + parseInt(e.totalAmt);
              } 
            else if (e.credit_acc === req.query.supplier) {
                t = parseInt(t) + parseInt(e.amount) - parseInt(e.balance);
              }
          });
    
          res.send({balance : t});
    } catch (error) {
        res.send({error : error.message})
    }
    
})

route.get('/debited' , auth , async(req,res) => {
    try {
        let arr = await Vouchers(req.query.supplier)
        let t =0;
          arr.map(e => {
            if (e.supplier === req.query.supplier) {
              t = parseInt(t) + parseInt(e.totalAmt);
            } 
            else if (e.debit_acc === req.query.supplier) {
              t = parseInt(t) + (parseInt(e.amount) - parseInt(e.balance));
            }
           
          });
    
          res.send({balance : t});
    } catch (error) {
        res.send({error : error.message})
    }

})


route.get('/credited' , auth , async(req,res) => {
    try {
        let arr = await Vouchers(req.query.supplier)
        let t =0;
          arr.map(e => {
            if (e.customer === req.query.supplier) {
                t = parseInt(t) + parseInt(e.totalAmt);
              } 
            else if (e.credit_acc === req.query.supplier) {
                t = parseInt(t) + parseInt(e.amount) - parseInt(e.balance);
              }
           
          });
    
          res.send({balance : t});
    } catch (error) {
        res.send({error : error.message})
    }

})
module.exports = {route}
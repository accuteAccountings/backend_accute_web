const route = require("express").Router();
const {Vouch , JoVouch} = require('../../db/db')
const seq = require('sequelize')
const {auth} = require('../../middleware/auth')

route.get('/total' , auth ,  async(req,res) => {
    try {
        const rec = await Vouch.findAll({
            where: {
              [seq.Op.and]: [
                { [seq.Op.or]: [{ supplier: req.query.supplier }, { customer: req.query.supplier }] },
                {IsDeleted : false }
              ]
            }
          });
      
          const recJO = await JoVouch.findAll({
            where: {
              [seq.Op.and]: [
                { [seq.Op.or]: [{ credit_acc: req.query.supplier }, { debit_acc: req.query.supplier }] },
                {IsDeleted : false }
              ]
            }
          })
          var arr = rec.concat(recJO);
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
module.exports = {route}
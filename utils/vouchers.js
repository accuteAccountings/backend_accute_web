const {Vouch , JoVouch} = require('../db/db')
const seq = require('sequelize')

async function Vouchers(supplier){
    const rec = await Vouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{supplier }, { customer: supplier }] },
            {IsDeleted : false }
          ]
        }
      });
  
      const recJO = await JoVouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{ credit_acc: supplier }, { debit_acc: supplier }] },
            {IsDeleted : false }
          ]
        }
      })
      var arr = rec.concat(recJO);
      return arr
}

module.exports = {Vouchers}
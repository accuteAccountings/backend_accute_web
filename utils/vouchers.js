const { Vouch, JoVouch } = require('../db/db');
const seq = require('sequelize');

async function Vouchers(supplier) {
  supplier = parseInt(supplier);
  const rec = await Vouch.findAll({
    where: {
      [seq.Op.and]: [{ [seq.Op.or]: [{ supplier_id: supplier }, { customer_id: supplier }] }, { IsDeleted: false }],
    },
  });
  console.log('I am in voucher ledger balaalla', supplier, rec);

  const recJO = await JoVouch.findAll({
    where: {
      [seq.Op.and]: [{ [seq.Op.or]: [{ credit_acc_id: supplier }, { debit_acc_id: supplier }] }, { IsDeleted: false }],
    },
  });
  var arr = rec.concat(recJO);
  return arr;
}

module.exports = { Vouchers };

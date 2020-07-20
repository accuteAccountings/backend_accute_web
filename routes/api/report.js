const {Router} = require('express')
const route = Router()
const {Vouch , JoVouch} = require('../../db/db')
const {auth} = require('../../middleware/auth')
const seq = require('sequelize')

route.get('/sales' , auth , async(req , res) => {
    console.log(req.query.edate)
    if(req.query.month){
        const sales = await Vouch.findAll({
            where : {
                [seq.Op.and] : [
                    { [seq.Op.or]: [{ supplier: req.query.supplier }, { customer: req.query.supplier }] },
                    { bill_date: { [seq.Op.like]: [`${req.query.month}%`] } }
                ]
            }
        })

     const recJO = await JoVouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{ credit_acc: req.query.supplier }, { debit_acc: req.query.supplier }] },
            { bill_date: { [seq.Op.like]: [`${req.query.month}%`] } }
        ]
        }
      });

      let arr = sales.concat(recJO)
    res.send(arr)

    }
    else{
      var Det = []

      var date = new Date()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      if(parseInt(month) < 10){
        month = '0'+ month
      }
      let startdate = 1
      let enddate = 5
    

      while(parseInt(enddate) < 32){

      if(parseInt(startdate) < 10){
          startdate = '0' + startdate
      }
     if(parseInt(enddate) < 10){
     enddate = '0' + enddate
      }

    let sdate = year + '-' + month + '-' + startdate 
    let edate = year + '-' + month + '-' + enddate 

    const sales = await Vouch.findAll({
        where : {
            [seq.Op.and] : [
                { [seq.Op.or]: [{ supplier: req.query.supplier }, { customer: req.query.supplier }] },
                { bill_date: { [seq.Op.between]: [sdate,edate] } }
            ]
        }
    })

    const recJO = await JoVouch.findAll({
        where: {
          [seq.Op.and]: [
            { [seq.Op.or]: [{ credit_acc: req.query.supplier }, { debit_acc: req.query.supplier }] },
            { bill_date: { [seq.Op.between]: [sdate, edate] } }
          ]
        }
      });

    Det.push({vouch : sales , jovouch : recJO})

    startdate = parseInt(startdate) + 5
    enddate = parseInt(enddate) + 5

    }

    res.send(Det)
}
})

route.get('/daywise' , auth , async(req , res) => {
  let arr = [];
  var date = new Date()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  if(parseInt(month) < 10){
    month = '0'+ month
  }

  for(let i = 0 ; i < 7 ; i++){

    let cdate = date.getDate() - parseInt(i)
    if(parseInt(cdate) < 10){
        cdate = '0' + cdate
    }
    var finaldate = year + '-' + month + '-' + cdate

  const sales = await Vouch.findAll({
      where : {
          [seq.Op.and] : [
              { [seq.Op.or]: [{ supplier: req.query.supplier }, { customer: req.query.supplier }] },
              { bill_date: { [seq.Op.like]: [`${finaldate}%`] } }
          ]
      }
  })

const recJO = await JoVouch.findAll({
  where: {
    [seq.Op.and]: [
      { [seq.Op.or]: [{ credit_acc: req.query.supplier }, { debit_acc: req.query.supplier }] },
      { bill_date: { [seq.Op.like]: [`${finaldate}%`] } }
  ]
  }
});


    arr.push({vouch : sales , jovouch : recJO})
 

  }
res.send(arr)
})



module.exports = {route}
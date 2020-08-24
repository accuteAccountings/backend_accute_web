const {Router, response} = require('express')
const route = Router()
const {Invoice , Invoice_Services} = require('../../db/db')
const {auth} = require('../../middleware/auth')


route.post('/' , auth , async(req,res) => {

    let date = new Date()
    let today = date.getDate()
    let year = date.getFullYear()
    let month = parseInt(date.getMonth()) + 1;
    if(parseInt(month) < 10){
        month = '0' + month
    }

    let fdate = today + '/' + month + '/' + year

    const inv = await Invoice.create({
        supplier : req.body.supplier,
        date : fdate,
        UserId : req.user.id
    })

    if(inv){
        res.send(inv)
    }
})

route.post('/Services' , auth , async(req,res) => {
    const Services = await Invoice_Services.create({
        services_details : req.body.service_details,
        sales_amount : req.body.sales_amount,
        commission : req.body.commission,
        InvoiceId : req.body.inv_id
    })
    if(Services){
        res.send(true)
    }
})

route.get('/Invoices', auth , async(req,res) => {
    const Invoices = await Invoice.findAll({
        where : {UserId : req.user.id}
    })
    res.send(Invoices)
})

route.get('/Services' , auth , async(req,res) => {
    const Services = await Invoice_Services.findAll({
        where : {InvoiceId : req.query.id}
    })

    res.send(Services)
})


module.exports = {route}
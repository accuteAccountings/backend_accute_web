const seq = require('sequelize')

const dotenv = require('dotenv')
dotenv.config();

const db = new seq({
    dialect: "mysql",
    host: process.env.aws_mysql_host,
    database: "ledgerApp",
    username: process.env.aws_mysql_username,
    password: process.env.aws_mysql_pass,
})


const Users = db.define('Users', {

    id: {
        type: seq.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    username: {
        type: seq.STRING(40),
        allowNull: false,
        primaryKey: true


    },
    password: {
        type: seq.STRING(40),


    },

    token: {
        type: seq.STRING(15),
        allowNull: false,
    },
    full_name: {
        type: seq.STRING(70),
        allowNull: false,
    }
    ,
    email: {
        type: seq.STRING(50),
        allowNull: false,
    }
    ,
    phone_num: {
        type: seq.INTEGER,
        unique: true

    }
    ,
    occupation: {
        type: seq.TEXT
    },
    pro_img:{
        type:seq.TEXT
    }


})

const Products = db.define('Products' ,{

    product_name:{
        type:seq.STRING(100),
        allowNull:false
    }
,
    hsn_num :{
        type:seq.STRING(50),
        allowNull:false,
        unique:true,
        primaryKey:true
    }





} )

Products.belongsTo(Users)


const Accounts = db.define('Accounts' ,{

    Account_name:{
        type:seq.STRING(100),
        allowNull:false
    },
    print_name:{
        type:seq.STRING(100),
    },
    acc_type:{
        type:seq.STRING(20),
    }
,
    num :{
        type:seq.STRING(50),
        allowNull:false,
        unique:true,
        primaryKey:true
    }





} )

Accounts.belongsTo(Users)

module.exports = { db, Users , Products}
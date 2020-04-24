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

    username: {
        type: seq.STRING(40),
        allowNull: false,
        unique: true,

    },
    password: {
        type: seq.STRING(40),
        allowNull: false,


    },

    token: {
        type: seq.STRING(15),
        allowNull: false,
        unique: true
    },
    full_name: {
        type: seq.STRING(70),
        allowNull: false,
    }
    ,
    email: {
        type: seq.STRING(50),
        allowNull: false,
        unique: true
    }
    ,
    phone_num: {
        type: seq.INTEGER,
        allowNull: false,
        unique: true

    }
    ,
    occupation: {
        type: seq.TEXT
    }


})

module.exports = { db, Users }
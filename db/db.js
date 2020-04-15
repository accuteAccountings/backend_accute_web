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


const users = db.define('users', {

    username: {
        type: seq.STRING(20),
        allowNull: false,
        unique: true,

    },
    password: {
        type: seq.STRING(40),
        allowNull: false,


    }

})

module.exports = { db, users }
const exp = require('express')
const app = exp()
const { db } = require('./db/db')

app.use('/api', require('./routes/api/index').route)





db.sync().then(() => {
    app.listen(5000, () => {
        console.log("Server started at http://0.0.0.0:5000")
    })
})
const exp = require('express')
const app = exp()
const { db } = require('./db/db')
const session = require('express-session')
const { passport } = require('./middleware/passport')

// Middlewares  

app.use('/', exp.static(`${__dirname}/public`));

app.use(exp.json())
app.use(exp.urlencoded({ extended: true }))
app.use(
    session({
        secret: process.env.session_sec,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: false
        }

    })
)
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./routes/api/index').route)





db.sync({}).then(() => {
    app.listen(5000, () => {
        console.log("Server started at http://0.0.0.0:5000")
    })
})
const { Users } = require('../db/db')

async function auth(req, res, next) {


    let token = false;
    let authUser = false;
    if (req.session) { token = req.session.token; }

    if (token) {


        authUser = await Users.findOne({
            where: {
                token: token
            }
        })

    }

    if (authUser) {
        req.user = authUser
        next()
    }

    else {
        res.redirect("/home")
    }


}

module.exports = { auth }
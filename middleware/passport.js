const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Users } = require('../db/db')


passport.serializeUser(function (user, done) {
    console.log("ser")
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    console.log("des")
    Users.findOne({
        where: {
            username: username
        }
    }).then((u) => {

        if (!u) {
            return done(new Error("User not found"))
        }

        return done(null, u)
    })
        .catch((err) => {
            return done(err)
        })
});



passport.use(new LocalStrategy(
    function (username, password, done) {


        console.log("hiii")
        Users.findOne({
            where: {
                username: username
            }
        }).then((u) => {
            if (u.password == password) {
                return done(null, u)
            }
            else {
                return done(null, false, { msg: "Username or Password is  Incorrect" })
            }
        })
            .catch((err) => {
                return done(err)
            })
    }
));





module.exports = { passport }

const exp = require("express");
const app = exp();
const { db } = require("./db/db");
const session = require("express-session");
const { auth } = require("./middleware/auth");
const path = require("path");
const upload = require("express-fileupload");
//test
//For express sessions
app.use(
  session({
    secret: process.env.session_sec,
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: true }
  })
);

//For parsing data to json() and urlencoded
app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));

//For Uploading data
app.use(upload());

//Main Website static serving
app.use(exp.static(path.join(__dirname, "build")));
//Main api routes
app.use("/api", require("./routes/api/index").route);
//To compaitable with react
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

db.sync({alter:true}).then(() => {
  app.listen(process.env.port, () => {
    console.log("Server started at http://0.0.0.0:" + process.env.port);
  });
});
// temp handlers

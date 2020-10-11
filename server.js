const exp = require("express");
const app = exp();
const { db } = require("./db/db");
const session = require("express-session");
const { auth } = require("./middleware/auth");
const path = require("path");
const upload = require("express-fileupload");
//develp
app.use(
  session({
    secret: process.env.session_sec,
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: true }
  })
);
app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));
app.use(upload());
app.use(exp.static(path.join(__dirname, "build")));
app.use("/api", require("./routes/api/index").route);
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

db.sync().then(() => {
  app.listen(process.env.port, () => {
    console.log("Server started at http://0.0.0.0:" + process.env.port);
  });
});
// temp handlers

const route = require("express").Router();

route.use("/register", require("./register").route);
route.use("/login", require("./login").route);
route.use("/profile", require("./profile").route);
route.use("/products", require("./products").route);
route.use("/accounts", require("./accounts").route);
route.use("/vouch", require("./vouch").route);
route.use("/report", require("./report").route);
route.use("/letters", require("./cover_letters").route);
route.use("/jovouch", require("./jovouch").route);
route.use("/invoice", require("./invoice").route);
route.use("/users", require("./user").route);

module.exports = { route };

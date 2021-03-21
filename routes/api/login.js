const route = require("express").Router();
const { Users } = require("../../db/db");
const { auth } = require("../../middleware/auth");
const nodemailer = require("nodemailer");
const { getrandomnum } = require("../../utils/token_gen");
const axios = require("axios").default;

// login handler
route.post("/", async (req, res) => {
  if (process.env.apiLogs == "true") {
    console.log("[post]/api/login");
  }
  if (process.env.apiBodyData == "true") {
    console.log("[post Data]");
    console.log(req.body);
  }

  let currentUser = req.body;

  try {
    let registeredUser = await Users.findOne({
      where: {
        email: currentUser.email,
      },
    });

    if (!registeredUser) {
      res.status(404).send({ error: "username not found" });
    }

    if (registeredUser.password === currentUser.password) {
      req.session.token = registeredUser.token;
      req.session.save();

      const sendingData = `Just Logged In :- ${registeredUser.email}`;

      axios.post(`https://api.telegram.org/bot${process.env.telegramBotToken}/sendMessage`, {
        chat_id: process.env.chatIdTushar,
        text: sendingData,
      });

      res.status(200).send({
        user: {
          username: registeredUser.username,
          pro_img: registeredUser.pro_img,
          full_name: registeredUser.full_name,
        },
      });
    } else {
      let wrongPass = `${registeredUser.email} Just Entered Wrong Password`;
      axios.post(`https://api.telegram.org/bot${process.env.telegramBotToken}/sendMessage`, {
        chat_id: process.env.chatIdTushar,
        text: wrongPass,
      });

      res.status(401).send({ error: "Password is incorrect" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Error" });
  }
});

route.get("/", auth, (req, res) => {
  if (process.env.apiLogs == "true") {
    console.log("[get]/api/login");
  }
  res.status(200).send({ username: req.user.username });
});

route.delete("/", auth, (req, res) => {
  if (process.env.apiLogs == "true") {
    console.log("[delete]/api/login");
  }
  req.session.token = null;
  req.session.save();
  res.status(200).redirect("/home");
});

route.post("/ForgotPassword", async (req, res) => {
  if (process.env.apiLogs == "true") {
    console.log("[post]/api/login/ForgotPassword");
  }
  if (process.env.apiBodyData == "true") {
    console.log("[post Data]");
    console.log(req.body);
  }

  try {
    const userEmail = req.body.email;
    let RegisteredUser = await Users.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!RegisteredUser) {
      res.status(404).send({ error: "User Not Registered" });
    }

    const otp = await getrandomnum(5);
    RegisteredUser.passwordResetOtp = otp;
    RegisteredUser.save();

    let transporter = nodemailer.createTransport({
      host: "accute.live",
      port: 25,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.emailId,
        pass: process.env.emailPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let info = await transporter.sendMail({
      from: "Accute Accountings <no-reply@accute.live>",
      to: `${req.body.email}`,
      subject: "Reset your password",
      text: "Enter this otp to restore your Password",
      html: `<div>
                <p>You told us you'd forgotten your password.If you really have
                ,use below OTP to change your password</p>
                <div><b> <h2>${otp}</h2></b></div>
                <div><p>If you didn't mean to reset your password , then you can
                ignore this email; you password will not change.
             </div>`,
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).send(otp);
  } catch (err) {
    console.error(err);
    res.status(300).send({ error: "error Occured" });
  }
});

route.put("/", async (req, res) => {
  const user = await Users.findOne({
    where: { email: req.body.email },
  });
  if (req.body.password) {
    user.password = req.body.password;
    user.save();
  }
  res.send(true);
});

module.exports = { route };

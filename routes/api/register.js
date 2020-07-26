const route = require("express").Router();
const fetch = require("node-fetch");
const { isUserExist, isUserExistEmail, createNewUser, createNewUserGoogle } = require("../../controller/users");

route.post("/", async (req, res) => {
  try {
    let check = await isUserExistEmail(req.body.user.email);
    if (check) {
      if (check.error) {
        res.status(500).send({
          error: "Unable to create new user (server error)"
        });
      } else {
        res.status(400).send({
          error: "Email already exists"
        });
      }
    } else {
      if (req.body.user) {
        let newUser = await createNewUser(req.body.user);

        if (newUser.user.username) {
          console.error("New User Created");

          res.status(201).send({
            user: {
              username: newUser.user.username,
              token: newUser.user.token
            }
          });
        } else {
          res.status(500).send({
            error: "Unable to register Please try again "
          });
        }
      }
    }
  } catch (err) {
    throw new Error(err);
    res.status(500).send({ error: "Internal Error" });
  }
});

route.post("/facebook", async (req, res) => {
  let at = req.body.accessToken;
  let user_id = null;
  let url = `https://graph.facebook.com/debug_token?input_token=${at}&access_token=${process.env.fb_app_id}|${process.env.fb_app_sec}`;
  await fetch(url, {
    method: "GET"
  })
    .then(res => res.json())
    .then(data => {
      if (data.data.user_id) {
        user_id = data.data.user_id;
      }
    })
    .catch(err => {
      res.status(500).send({ error: "Internal Error" });
    });

  let userData = null;

  if (user_id) {
    let url2 = `https://graph.facebook.com/me?fields=id,name,email&access_token=${at}`;
    await fetch(url2, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          userData = {
            email: data.email,
            name: data.name,
            pro_pic: req.body.pic
          };
        }
      })
      .catch(err => {
        throw new Error(err);
        res.status(500).send({ error: "Internal Error" });
      });

    if (userData) {
      let exist = await isUserExistEmail(userData.email);

      if (!(exist === false) && !exist.error) {
        req.session.token = exist.token;
        req.session.save();

        res.status(200).send({ email: userData.email });
      } else if (exist === false) {
        let newUser = await createNewUserGoogle(userData);

        if (newUser.user.email) {
          req.session.token = newUser.user.token;
          req.session.save();

          res.status(200).send({
            email: newUser.user.email
          });
        } else {
          res.status(500).send({ error: "internal error" });
        }
      } else {
        console.error("error");
        res.status(500).send("error");
      }
    } else {
      res.status(500).send("no");
    }
  } else {
    res.status(500).send({ error: "Try Again later" });
  }
});

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("859167314128-9b2cts4vdhi2m869ar0sqh0i4del5vb4.apps.googleusercontent.com");

route.post("/google", async (req, res) => {
  let user = null;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.tokenId,
      audience: "859167314128-9b2cts4vdhi2m869ar0sqh0i4del5vb4.apps.googleusercontent.com"
    });
    const payload = ticket.getPayload();

    user = {
      email: payload.email,
      name: payload.name,
      pro_pic: payload.picture
    };
  }
  await verify().catch(error => {
    console.error(error);
    res.status(500).send({ error: "google auth error" });
  });

  if (user) {
    let exist = await isUserExistEmail(user.email);

    if (!(exist === false) && !exist.error) {
      req.session.token = exist.token;
      req.session.save();

      res.status(200).send({ email: user.email });
    } else if (exist === false) {
      let newUser = await createNewUserGoogle(user);

      if (newUser.user.email) {
        req.session.token = newUser.user.token;
        req.session.save();

        res.status(200).send({
          email: newUser.user.email
        });
      } else {
        res.status(500).send({ error: "internal error" });
      }
    } else {
      console.error("error");
      res.status(500).send("error");
    }
  } else {
    res.status(500).send("no");
  }
});

module.exports = { route };

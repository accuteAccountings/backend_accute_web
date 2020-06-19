const route = require('express').Router();
const { auth } = require('../../middleware/auth');
const { Users } = require('../../db/db');

route.get('/img', auth, (req, res) => {
	res.send({ pro_img: req.user.pro_img });
});

route.get('/name', auth, (req, res) => {
	res.send({ name: req.user.full_name });
});

route.post('/img', auth, (req, res) => {
	req.user.pro_img = req.body.pro_img;
	Users.save();
	res.send({ pro_img: req.user.pro_img });
});

module.exports = { route };

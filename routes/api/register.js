const route = require('express').Router();
const fetch = require('node-fetch');
const { isUserExist, isUserExistEmail, createNewUser, createNewUserGoogle } = require('../../controller/users');

route.post('/', async (req, res) => {
	let check = await isUserExist(req.body.user.username);
	if (check) {
		if (check.error) {
			res.send({
				error: 'unable to create new user (server error)'
			});
		} else {
			res.send({
				error: 'User already exists'
			});
		}
	} else {
		if (req.body.user) {
			let newUser = await createNewUser(req.body.user);

			if (newUser.user.username) {
				console.log('New User Created');

				res.send({
					user: {
						username: newUser.user.username,
						token: newUser.user.token
					}
				});
			} else {
				res.send({
					error: 'Unable to register Please try again '
				});
			}
		}
	}
});

route.post('/facebook', async (req, res) => {
	let at = req.body.accessToken;
	let user_id = null;
	let url = `https://graph.facebook.com/debug_token?input_token=${at}&access_token=${process.env.fb_app_id}|${process
		.env.fb_app_sec}`;
	await fetch(url, {
		method: 'GET'
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.data.user_id) {
				user_id = data.data.user_id;
			}
		})
		.catch((err) => {
			console.log(err);
			res.send({ error: err });
		});

	let userData = null;

	if (user_id) {
		let url2 = `https://graph.facebook.com/me?fields=id,name,email&access_token=${at}`;
		await fetch(url2, {
			method: 'GET'
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.email) {
					userData = {
						email: data.email,
						name: data.name,
						pro_pic: req.body.pic
					};
					console.log(userData);
				}
			});
		console.log(userData);
		if (userData) {
			let exist = await isUserExistEmail(userData.email);

			if (!(exist === false) && !exist.error) {
				req.session.token = exist.token;
				req.session.save();
				console.log(req.session);

				res.send({ email: userData.email });
			} else if (exist === false) {
				let newUser = await createNewUserGoogle(userData);

				if (newUser.user.email) {
					req.session.token = newUser.user.token;
					req.session.save();

					res.send({
						email: newUser.user.email
					});
				} else {
					res.send({ error: 'internal error' });
				}
			} else {
				console.log('error');
				res.send('error');
			}
		} else {
			res.send('no');
		}
	} else {
		res.send({ error: 'Try Again later' });
	}
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('462910295856-fjou78vc3gmfnhjgtvplk4vv5bvalrmj.apps.googleusercontent.com');

route.post('/google', async (req, res) => {
	let user = null;

	console.log(req.body);

	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: req.body.tokenId,
			audience: '462910295856-fjou78vc3gmfnhjgtvplk4vv5bvalrmj.apps.googleusercontent.com'
		});
		const payload = ticket.getPayload();

		user = {
			email: payload.email,
			name: payload.name,
			pro_pic: payload.picture
		};
	}
	await verify().catch((error) => {
		console.log(error);
		res.send({ error: 'google auth error' });
	});

	if (user) {
		let exist = await isUserExistEmail(user.email);

		if (!(exist === false) && !exist.error) {
			req.session.token = exist.token;
			req.session.save();

			res.send({ email: user.email });
		} else if (exist === false) {
			let newUser = await createNewUserGoogle(user);

			if (newUser.user.email) {
				req.session.token = newUser.user.token;
				req.session.save();

				res.send({
					email: newUser.user.email
				});
			} else {
				res.send({ error: 'internal error' });
			}
		} else {
			console.log('error');
			res.send('error');
		}
	} else {
		res.send('no');
	}
});

module.exports = { route };

const route = require('express').Router();
const { Products } = require('../../db/db');
const { auth } = require('../../middleware/auth');

route.post('/', auth, (req, res) => {
	const prod = Products.create({
		UserId: req.user.id,
		product_name: req.body.product_name,
		hsn_num: req.body.hsn_num
	})
		.then((p) => {
			res.send({ product: p });
		})
		.catch((err) => {
			console.log(err);
			res.send({ error: err });
		});
});

route.put('/', auth, (req, res) => {
	const prod = Products.findOne({
		where: {
			UserId: req.user.id,
			id: req.body.id
		}
	})
		.then((p) => {
			p.product_name = req.body.product_name;
			p.hsn_num = req.body.hsn_num;

			p
				.save()
				.then(() => {
					res.send({ product: p });
				})
				.catch((err) => {
					console.log(err);
					res.send({ error: err });
				});
		})
		.catch((err) => {
			console.log(err);
			res.send({ error: err });
		});
});

route.get('/', auth, (req, res) => {
	let allUserPro = Products.findAll({
		where: {
			UserId: req.user.id
		},
		order: [ [ 'createdAt', 'ASC' ] ]
	})
		.then((p) => {
			res.send({
				Products: p
			});
		})
		.catch((err) => {
			console.log(err);
			res.send({
				error: err
			});
		});
});

route.delete('/:id', auth, (req, res) => {
	let id = req.params.id;

	Products.destroy({
		where: {
			UserId: req.user.id,
			id
		}
	})
		.then((re) => {
			console.log('deleted Product');

			res.send({
				deleted: `Product(${id})`
			});
		})
		.catch((err) => {
			console.log(err);
			res.send({
				error: err
			});
		});
});

module.exports = { route };

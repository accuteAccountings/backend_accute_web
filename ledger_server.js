const exp = require('express');
const app = exp();
const { db } = require('./db/db');
const session = require('express-session');
const { auth } = require('./middleware/auth');

// Middlewares s

app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.session_sec,
		resave: true,
		saveUninitialized: true,
		cookie: {
			httpOnly: true
		}
	})
);

app.use('/main', auth, exp.static('./public/main'));
app.use('/home', exp.static(`${__dirname}/public/home`));
app.use('/api', require('./routes/api/index').route);
app.get('/', (req, res) => {
	res.redirect('http://3.7.27.81:5000/main/');
});

let port = 5000;
db.sync({}).then(() => {
	app.listen(process.env.port || port, () => {
		console.log('Server started at http://0.0.0.0:5000');
	});
});

// temp handlers

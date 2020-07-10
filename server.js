const exp = require('express');
const app = exp();
const { db } = require('./db/db');
const pdf = require('html-pdf')
const session = require('express-session');
const { auth } = require('./middleware/auth');
const upload = require('express-fileupload');

// Middlewares s

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
app.get('/', (req, res) => {
	res.redirect('/home');
});
app.use('/main', auth, exp.static('./public/main'));
app.use('/home', exp.static(`${__dirname}/public/home`));
app.use('/api', require('./routes/api/index').route);

app.post('/create-pdf' , (req,res) => {
	pdf.create(pdfTemplate(req.body) , {}).toFile('result.pdf' , (err) => {
		if(err){
			res.send(Promise.reject());
		}

		 res.send(Promise.resolve());
	})
})

app.get('/fetch-pdf' , (req,res) => {
	res.sendFile(`${__dirname}/result.pdf`	)
})

db.sync().then(() => {
	app.listen(process.env.port, () => {
		console.log('Server started at http://0.0.0.0:' + process.env.port);
	});
});

// temp handlers

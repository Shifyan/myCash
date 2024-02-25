const express = require('express');
const path = require('path');
require('./utils/dbConnect');
const UserData = require('./utils/dbLogic');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Inisiasi port
const app = express();
const port = 3000;

// Session-Express
app.use(
	session({
		// Session untuk user sekitar 1 jam
		secret: 'highSecret',
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60000 * 60 },
	}),
);

// Ejs View Engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Salt Round
const saltRounds = 10;

// Halaman Home
app.get('/home', (req, res) => {
	if (!req.session.user) {
		// Jika pengguna tidak masuk, arahkan kembali ke halaman login
		return res.redirect('/');
	}
	res.render('home');
});
// Halaman Login
app.get('/', (req, res) => {
	res.render('login');
});

// Halaman Daftar
app.get('/daftar', (req, res) => {
	res.render('daftar');
});

// Menangani Form Login
app.post('/login', body('username').toLowerCase(), async (req, res) => {
	let user = await UserData.findOne({ userName: req.body.username });
	// Validasi username
	if (!user) {
		return res.redirect('/');
	}
	// Validasi password
	let hash = user.password;
	const pwValidation = await bcrypt.compare(req.body.password, hash);
	if (!pwValidation) {
		return res.redirect('/');
	}

	// Jika Usernam dan Password Valid, Masuk Ke Home
	req.session.user = user;
	res.redirect('/home');
});

// Menangani Form Daftar
app.post(
	'/register',
	// Middleware untuk cek username ganda
	body('username')
		.toLowerCase()
		.custom(async (value) => {
			const user = await UserData.findOne({ userName: value });
			console.log(user);
			if (user) {
				throw new Error(`Username ${value} sudah digunakan`);
			}
		}),
	async (req, res) => {
		// Jika username ganda
		let err = validationResult(req).array();
		console.log(err);
		if (err.length !== 0) {
			res.send(err[0].msg);
			return;
		}
		// Jika berhasil daftar
		let hash = await bcrypt.hash(req.body.password, saltRounds);
		let validationUser = await UserData.insertMany({
			userName: req.body.username,
			password: hash,
		});
		req.session.user = validationUser;
		res.redirect('/home');
	},
);

// Penanganan Rute Ridak ditemukan
app.use((req, res) => {
	res.status(404);
	res.send('<h1>Halaman Tidak Ditemukan</h1>');
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
	console.log(`Your App is Running in port ${port}`);
});

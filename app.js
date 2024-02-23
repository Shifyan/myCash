const express = require('express');
const path = require('path');
require('./utils/dbConnect');
const UserData = require('./utils/dbLogic');
const session = require('express-session');

// Inisiasi port
const app = express();
const port = 3000;

// Session-Express
app.use(
	session({
		secret: 'highSecret',
		resave: false,
		saveUninitialized: true,
	}),
);

// Ejs View Engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

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
app.post('/login', async (req, res) => {
	let validationUser = await UserData.findOne({ userName: req.body.username });

	if (!validationUser) {
		return res.redirect('/');
	}
	if (req.body.password != validationUser.password) {
		return res.redirect('/');
	}
	req.session.user = validationUser;
	res.redirect('/home');
});

// Menangani Form Daftar
app.post('/register', async (req, res) => {
	let validationUser = await UserData.insertMany({
		userName: req.body.username,
		password: req.body.password,
	});
	req.session.user = validationUser;
	res.redirect('/home');
});

// Penanganan Rute Ridak ditemukan
app.use((req, res) => {
	res.status(404);
	res.send('<h1>Halaman Tidak Ditemukan</h1>');
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
	console.log(`Your App is Running in port ${port}`);
});

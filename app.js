const express = require('express');
const path = require('path');
require('./utils/dbConnect');
const UserData = require('./utils/dbLogic');

// Inisiasi port
const app = express();
const port = 3000;

// Ejs View Engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

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
	res.send('Berhasil Masuk');
});

// Menangani Form Daftar
app.post('/register', async (req, res) => {
	await UserData.insertMany({
		userName: req.body.username,
		password: req.body.password,
	});
	res.redirect('/daftar');
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

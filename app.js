const express = require('express');
const path = require('path');

// Inisiasi port
const app = express();
const port = 3000;

// Ejs View Engine
app.set('view engine', 'ejs');

// Halaman Login
app.get('/', (req, res) => {
	res.render('login');
});

// Halaman Daftar
app.get('/daftar', (req, res) => {
	res.render('daftar');
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

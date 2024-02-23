const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userName: String,
	password: String,
});
const UserData = mongoose.model('user', userSchema);

module.exports = UserData;

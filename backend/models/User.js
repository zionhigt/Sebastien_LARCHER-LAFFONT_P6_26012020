const mongoose = require('mongoose');
const role = require('mongoose-role')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true}
}, { autoIndex: false })

userSchema.plugin(uniqueValidator);
userSchema.plugin(role, {
	roles: ['public', 'user', 'admin'],
	accessLevels: {
		public: ['public', 'user', 'admin'],
		anon: ['public'],
		user: ['user', 'admin'],
		admin: ['admin']
	}
});

module.exports = mongoose.model('User', userSchema);
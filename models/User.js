const mongoose = require('mongoose')

const user_schema = new mongoose.Schema({
	firstName: {
		type: String,
		require: [true, "First Name is required."]
	},
	lastName: {
		type: String,
		require: [true, "Last Name is required."]
	},
	mobileNumber: {
		type: String,
		require: [true, "Mobile Number is required."]
	},
	email: {
		type: String,
		require: [true, "Email is required."]
	},
	password: {
		type: String,
		required: [true, "Password is required."]
	},
	isAdmin: {
		type: Boolean, 
		default: false
	},
	isActive: {
		type: Boolean, 
		default: true
	}
})

module.exports = mongoose.model('User', user_schema)
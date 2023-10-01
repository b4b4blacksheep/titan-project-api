const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  country: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  company: { type: String, required: false },
  address: { type: String, required: false },
  apartment: { type: String, required: false },
  postalCode: { type: String, required: false },
  city: { type: String, required: false },
  region: { type: String, required: false },
  phone: { type: String, required: false },
  isPrimary: { type: Boolean, default: false }
});

const user_schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required."]
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required."]
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile Number is required."]
  },
  email: {
    type: String,
    required: [true, "Email is required."]
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
  },
  addresses: [addressSchema]
});

module.exports = mongoose.model('User', user_schema);

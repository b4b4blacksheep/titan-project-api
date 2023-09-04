const mongoose = require('mongoose')

const product_schema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, "Name is required."]
	},
	description: {
		type: String,
		required: [true, "Description is required."]
	},
	price: {
		type: Number,
		required: [true, "Price is required."]
	},
	isActive: {
		type: Boolean, 
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
	imageLink: {
		type: String,
		require: [true, "Image Link is required."]
	},
	orders: [
		{
			orderId: {
				type: String,
				required: [true, 'OrderId is Required.']
			},
			orderedOn: {
				type: Date,
				default: new Date()
			}
		}
	]
})

module.exports = mongoose.model('Product', product_schema)

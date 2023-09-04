const mongoose = require('mongoose')

const order_schema = new mongoose.Schema({
	userId: {
		type: String,
		require: [true, "UserId is required."]
	},
	products: 
		[
			{
					productId: {
					type: String,
					require: [true, "ProductId is required."]
				},
					quantity: {
					type: Number
				},
					price: {
					type: Number
				},
			}
		],
	totalAmount: {
		type: Number,
		require: [true, "totalAmount is required."]
	},
	purchasedOn: {
		type: Date,
		default: new Date()
	},
	isActive: {
		type: Boolean, 
		default: true
	},
})

module.exports = mongoose.model('Order', order_schema)
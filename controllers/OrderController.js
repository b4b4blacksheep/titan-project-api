
const bcrypt = require('bcrypt')
const auth = require('../auth')

const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')



//CREATE ORDER [NON-ADMIN ONLY]
module.exports.createOrder = (data) => {
	if(data.isAdmin) {
		return Promise.resolve ({
			message: "This is an ADMIN account, invalid request."
		})
	} let new_order = new Order ({
		userId: data.userId,
		products: [{
			productId: data.products.productId,
			quantity: data.products.quantity,
			price: data.products.price
		}],
		totalAmount: data.totalAmount,
	}) 
	 console.log(data)

	return new_order.save().then((updated_order, error) => {
			if(error){
				return false
			}

		return ({
			message: 'Successful order created.'
		}) 

	})
}


// RETRIEVE ALL ORDERS
module.exports.retrieveAllOrder = () => {
	return Order.find({isActive: true}).then((result) => {
		return result
	})
}

// Retrieve authenticated user’s orders
module.exports.userOrders = (userId) => {

        return Order.find({userId: userId}).then(result => {
            if(result.length > 0){
                return result
            }
            return {
                message: "No orders found!"
            }
        })
    }


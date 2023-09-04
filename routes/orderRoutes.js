const express = require('express')
const router = express.Router()
const auth = require('../auth')

const UserController = require('../controllers/UserController')
const OrderController = require('../controllers/OrderController')


//CREATE ORDER [NON-ADMIN ONLY]
router.post('/create-order', auth.verify, (request, response) => {
	const data = {
		isAdmin: auth.decode(request.headers.authorization).isAdmin,
		userId: request.body.userId,
		products: request.body.products,
		productId: request.body.productId,
		quantity: request.body.quantity,
		price: request.body.price,
		totalAmount: request.body.totalAmount
	}

	OrderController.createOrder(data).then((result) => {
		response.send(result)
	})
})

//Retrieve all orders
router.get('/active-users', (request, response) => {
	OrderController.retrieveAllOrder().then((result) => {
		response.send(result)
	})
})


// Retrieve authenticated user’s orders
router.get('/user-order', auth.verify, (request, response) => {

	const userId = auth.decode(request.headers.authorization).id

	OrderController.userOrders(userId).then(result => {
		response.send(result)
	})

})
module.exports = router
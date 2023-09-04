const express = require('express')
const router = express.Router()
const auth = require('../auth')

const Product = require('../models/Product')
const ProductController = require('../controllers/ProductController')

const User = require('../models/User')
const UserController = require('../controllers/UserController')



//Add a product ADMIN ONLY
router.post('/create-product', auth.verify, (request, response) => {
	const data = {
		product: request.body,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}
	// console.log(data.product)
	ProductController.createProduct(data).then((result) => {
		response.send(result)
	})
})


// Retrieve all active products
router.get('/active-products', (request, response) => {
	ProductController.retrieveAllActive().then((result) => {
		response.send(result)
	})
})


// Retrieve single product
router.get('/:productId', (request, response) => {
	ProductController.getProduct(request.params.productId).then((result) => {
		response.send(result)
	})
})


//Update a product [ADMIN ONLY]
router.patch('/:productId/update-product', auth.verify, (request, response) => {
	const data = {
		product: request.body,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	ProductController.updateProduct(request.params.productId, data).then((result) => {
		response.send(result)
	})
})


//Archieve a product [ADMIN ONLY]
router.patch('/:productId/archive-product', auth.verify, (request, response) => {
	const data = {
		product: request.body,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	ProductController.archiveProduct(request.params.productId, data).then((result) => {
		response.send(result)
	})
})

//Archieve a product [ADMIN ONLY] (TO UNDO-DELTE)
router.patch('/:productId/archive-product-availability', auth.verify, (request, response) => {
	const data = {
		product: request.body,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	ProductController.archiveReturnProduct(request.params.productId, data).then((result) => {
		response.send(result)
	})
})


// Get all Products
router.get('/', (request, response) => {
	ProductController.getAllProducts().then((result) => {
		response.send(result)
	})
})



module.exports = router 


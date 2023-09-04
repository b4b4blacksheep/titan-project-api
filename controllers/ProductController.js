const Product = require('../models/Product')
const User = require('../models/User')

// ADD A PRODUCT ADMIN ONLY
module.exports.createProduct = (data) => {
	if(data.isAdmin){
		let new_product = new Product({
			name: data.product.name,
			description: data.product.description,
			price: data.product.price,
			imageLink: data.product.imageLink
		})
		
		return new_product.save().then((new_product, error) => {
			if(error){
				return false
			}

			return {
				message: 'New product successfully created!'
			}
		})
	}

	let message = Promise.resolve({
		message: 'User must be ADMIN to access this.'
	})

	return message.then((value) => {
		return value
	})
}


// RETRIEVE ALL ACTIVE PRODUCTS
module.exports.retrieveAllActive = () => {
	return Product.find({isActive: true}).then((result) => {
		return result
	})
}


// RETRIEVE SINGLE PRODUCT
module.exports.getProduct = (product_id) => {
	return Product.findById(product_id).then((result) => {
		return result 
	})
}


//UPDATE A PRODUCT [ADMIN ONLY]
module.exports.updateProduct = (product_id, product_update) => {
	if(product_update.isAdmin){
		return Product.findByIdAndUpdate(product_id, {
			name: product_update.product.name,
			description: product_update.product.description,
			price: product_update.product.price,
			imageLink: product_update.product.imageLink
		}).then((result, error) => {
			if(error) {
				return false
			}

			return {
				message: 'New product successfully created!'
			}
		})
	}

	let message = Promise.resolve({
		message: 'User must be ADMIN to access this.'
	})

	return message.then((value) => {
		return value
	})
}


//ARCHIVE A PRODUCT ADMIN ONLY (TO DELETE)
module.exports.archiveProduct = (product_id, product_update) => {
	if(product_update.isAdmin){
		return Product.findByIdAndUpdate(product_id, {
			isActive: product_update.product.isActive,
		}).then((result, error) => {
			if(error) {
				return false
			}

			return {
				message: 'Archiving a product successfully!'
			}
		})
	}

	let message = Promise.resolve({
		message: 'User must be ADMIN to access this.'
	})

	return message.then((value) => {
		return value
	})
}

//ARCHIVE A PRODUCT ADMIN ONLY (TO UNDO-DELTE)
module.exports.archiveReturnProduct = (product_id, product_update) => {
	if(product_update.isAdmin){
		return Product.findByIdAndUpdate(product_id, {
			isActive: product_update.product.isActive,
		}).then((result, error) => {
			if(error) {
				return true
			}

			return {
				message: 'Archiving a product successfully!'
			}
		})
	}

	let message = Promise.resolve({
		message: 'User must be ADMIN to access this.'
	})

	return message.then((value) => {
		return value
	})
}


// Get all Products
module.exports.getAllProducts = () => {
	return Product.find({}).then((result) => {
		return result
	})
}


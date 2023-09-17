const express = require('express');
const auth = require('../auth'); // Assuming auth is the name of your auth module
const CartController = require('../controllers/CartController'); // Assuming CartController is your controller for the cart

const router = express.Router();

router.post('/add-to-cart', auth.verify, async (request, response) => {
	try {
		const { isAdmin, id } = auth.decode(request.headers.authorization);
		const data = request.body;

		if(isAdmin === true || isAdmin === 'true'){
		  return response.status(403).json({ message: 'Admin is not allowed' });
		}
		
		const result = await CartController.addToCart(id, data);
		return response.status(201).json(result);

	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;
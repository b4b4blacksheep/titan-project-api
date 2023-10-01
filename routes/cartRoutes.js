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

router.get('/get-cart', auth.verify, async (request, response) => {
	try {
		const { isAdmin, id: userId } = auth.decode(request.headers.authorization);

		if(isAdmin === true || isAdmin === 'true') {
		  return response.status(403).json({ message: 'Admin is not allowed' });
		}
		
		const result = await CartController.viewCart(userId);

		if (!result || result.error) {
			return response.status(404).json({ message: 'Cart not found' });
		}

		return response.status(200).json(result);

	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: 'Internal server error' });
	}
});

router.delete('/remove-item/:cartId', auth.verify, async (request, response) => {
	try {
		const { isAdmin, id: userId } = auth.decode(request.headers.authorization);
		const cartId = request.params.cartId;

		if (isAdmin === true || isAdmin === 'true') {
		  return response.status(403).json({ message: 'Admin is not allowed' });
		}
		
		const result = await CartController.removeItemCart(userId, cartId);  // Added cartId here

		if (!result || result.error) {
			return response.status(404).json({ message: 'Cart not found' });
		}

		return response.status(200).json(result);

	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: 'Internal server error' });
	}
});


module.exports = router;
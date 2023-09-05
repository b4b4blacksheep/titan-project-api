const express = require('express')
const router = express.Router()
const auth = require('../auth')

const UserController = require('../controllers/UserController')
const OrderController = require('../controllers/OrderController')

// create-order [ user-only ]
router.post('/create-order', auth.verify, (request, response) => {
  try {
    // Extract relevant data from the request body
    const { products } = request.body;
    const userId = auth.decode(request.headers.authorization).id

    // Check if the user is an admin
    const isAdmin = auth.decode(request.headers.authorization).isAdmin;

    // Extract price and quantity from each product in the products array
    const formattedProducts = products.map(product => ({
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    }));

    // Construct the data object
    const data = {
      isAdmin,
      userId,
      products: formattedProducts, // Use the formatted products array
    };

    // Call the createOrder function
    OrderController.createOrder(data).then((result) => {
      response.send(result);
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

// all-orders [ user-only ]
router.get('/active-users', auth.verify, (request, response) => {
  try {
    // Check if the user is an admin
    const isAdmin = auth.decode(request.headers.authorization).isAdmin;

    if (!isAdmin) {
      return response.status(403).json({ error: 'Access denied. User must be an admin.' });
    }

    // If the user is an admin, proceed with retrieving data
    OrderController.retrieveAllOrder().then((result) => {
      response.send(result);
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

// all-orders [ user-only ]
router.get('/orders', auth.verify, async (request, response) => {
  try {
    // Ensure the user is authenticated
    const decodedToken = auth.decode(request.headers.authorization);
    
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const userId = decodedToken.id;

    // Retrieve user-specific orders
    const userOrders = await OrderController.userOrders(userId);

    if (!userOrders) {
      return response.status(404).json({ error: 'User orders not found.' });
    }

    response.json(userOrders);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router
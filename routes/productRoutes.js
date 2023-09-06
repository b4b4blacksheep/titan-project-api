const express = require('express')
const router = express.Router()
const auth = require('../auth')

const Product = require('../models/Product')
const ProductController = require('../controllers/ProductController')

const User = require('../models/User')
const UserController = require('../controllers/UserController')

// create-product [ admin-only ]
router.post('/create-product', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);
    const productData = request.body;

    const result = await ProductController.createProduct({ productData, isAdmin });
    
    response.send(result);
  } catch (error) {

    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

// active-products
router.get('/', (request, response) => {
  ProductController.retrieveAllActive().then((result) => {
      if (result.length === 0) {

        response.status(404).json({ message: 'No active products found' });
      } else {

        response.status(200).json(result);
      }
    })
    .catch((error) => {
      console.error('Error in /active-products route:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// retrieve-all-products [ admin only ]
router.get('/all-products', auth.verify, async (request, response) => {
  try {
    const isAdmin = auth.decode(request.headers.authorization).isAdmin;

    if(!isAdmin){
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    };

    const products = await ProductController.getAllProducts();
    response.json(products);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

//retrieve single product
router.get('/:productId', async (request, response) => {
    try {
        const productId = request.params.productId;

        // Validate productId length
        if (!productId || typeof productId !== "string" || productId.length !== 24) {
            return response.status(400).send('Invalid product ID');
        }

        const product = await ProductController.getProduct(productId);

        if (!product) {
            return response.status(404).send('Product not found');
        }

        response.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);

        response.status(500).send('Internal server error');
    }
});

// update-product [ admin only ]
router.patch('/:productId/update-product', async (request, response) => {
  try {
    const productId = request.params.productId;
    const productData = request.body;

    // Authenticate and check if the user is an admin using your auth module
    const isAdmin = await auth.decode(request.headers.authorization).isAdmin;

    if (!isAdmin) {
      return response.status(403).json({ error: 'Access denied. User must be ADMIN.' });
    }

    const result = await ProductController.updateProduct(productId, productData);

    if (result.error) {
      // Handle errors from ProductController.updateProduct
      return response.status(400).json({ error: result.error });
    }

    response.json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

// archive-product [ admin-only ]
router.delete('/:productId/archive-product', auth.verify, async (request, response) => {
  try {
    const productId = request.params.productId;
    const productData = request.body;

    // Authenticate and check if the user is an admin using your auth module
    const isAdmin = await auth.decode(request.headers.authorization).isAdmin;

    if (!isAdmin) {
      return response.status(403).json({ error: 'Access denied. User must be ADMIN.' });
    }

    const result = await ProductController.archiveProduct(productId, productData);

    if (result.error) {
      // Handle errors from ProductController.updateProduct
      return response.status(400).json({ error: result.error });
    }

    response.json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router 
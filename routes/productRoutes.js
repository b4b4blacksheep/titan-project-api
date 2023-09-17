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

  
  // Footwear

// all-active-footwear [ admin-only ]
router.get('/admin/all-active-footwear', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await ProductController.retrieveAllActiveFootwear();

    if (result.length === 0) {
      return response.status(404).json({ message: 'No active products found' });
    }

    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /active-products route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// non-active-footwear [ admin-only ]
router.get('/admin/non-active-footwear', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await ProductController.retrieveNonActiveFootwear();

    if (result.length === 0) {
      return response.status(404).json({ message: 'No products found' });
    }

    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /active-products route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// archived-footwear [ admin-only ]
router.get('/admin/archived-footwear', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await ProductController.retrieveArchivedFootwear();

    if (result.length === 0) {
      return response.status(404).json({ message: 'No archived products found' });
    }

    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /active-products route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Apparel

// all-active-apparel [ admin-only ]
router.get('/admin/all-active-apparel', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await ProductController.retrieveAllActiveApparel();

    if (result.length === 0) {
      return response.status(404).json({ message: 'No active products found' });
    }

    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /active-products route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// non-active-apparel [ admin-only ]
router.get('/admin/non-active-apparel', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await ProductController.retrieveNonActiveApparel();

    if (result.length === 0) {
      return response.status(404).json({ message: 'No products found' });
    }

    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /active-products route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// archived-footwear [ admin-only ]
router.get('/admin/archived-apparel', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await ProductController.retrieveArchivedApparel();

    if (result.length === 0) {
      return response.status(404).json({ message: 'No archived products found' });
    }

    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /active-products route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});


// new-products
router.get('/new-arrivals', (request, response) => {
  ProductController.retrieveNewProducts().then((result) => {
      if (result.length === 0) {

        response.status(404).json({ message: 'No new products found' });
      } else {

        response.status(200).json(result);
      }
    })
    .catch((error) => {
      console.error('Error in /active-products route:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// retrieve-onSale-products
router.get('/sale', async (request, response) => {
  ProductController.retrieveOnSale().then((result) => {
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

// retrieve-footwear-products
router.get('/footwear', async (request, response) => {
  ProductController.retrieveFootwear().then((result) => {
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

// retrieve-footwear-products [ admin-only ]
router.get('/footwear/all', auth.verify, async (request, response) => {
  try {
    const { isAdmin } = auth.decode(request.headers.authorization);

    if (!isAdmin) {
      return response.status(403).json({ error: 'Permission denied. Only admins can update this status.' });
    }

    const result = await ProductController.retrieveFootwearAdmin();

    if (result.length === 0) {
      return response.status(404).json({ message: 'No active products found' });
    }

    response.status(200).json(result);
  } catch (error) {
    console.error('Error in /active-products route:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// retrieve-apparel-products
router.get('/apparel', async (request, response) => {
  ProductController.retrieveApparel().then((result) => {
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

// retrieve-accessories-products
router.get('/accessories', async (request, response) => {
  ProductController.retrieveAccessories().then((result) => {
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

// retrieve-all-products
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
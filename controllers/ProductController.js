const Product = require('../models/Product')
const User = require('../models/User')

// create-product [ admin-only ]
module.exports.createProduct = async ({ isAdmin, productData }) => {
  try {
    if (!isAdmin) {
      throw new Error('User must be ADMIN to access this.');
    }

    // Check if the product with the same _id or sku already exists
    const existingProduct = await Product.findOne({
      $or: [
        { _id: productData._id },
        { sku: productData.sku },
      ],
    });

    if (existingProduct) {
      throw new Error('Product with the same _id or sku already exists.');
    }

    const newProductData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      imageLinks: productData.imageLinks,
      sku: productData.sku,
    };

    const newProduct = new Product(newProductData);

    const savedProduct = await newProduct.save();
    
    if (!savedProduct) {
      throw new Error('Failed to create the product.');
    }

    return {
      message: 'New product successfully created!',
    };
  } catch (error) {
    console.error(error);
    return {
      error: error.message || 'An error occurred while creating the product.',
    };
  }
};

// active-products
module.exports.retrieveAllActive = async () => {
  try {
    return await Product.find({ isActive: true }, { __v: 0, createdOn: 0, isActive: 0, orders: 0 });
  } catch (error) {
    throw error;
  }
};

// retrieve-single-product
module.exports.getProduct = async (product_id) => {
    try {
        const product = await Product.findById(product_id)
            .select('-orders -__v -createdOn -isActive');
        
        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        // Log the error (for your reference)
        console.error('Error fetching product:', error.message);
        
        // Throw the error so the caller can handle or respond accordingly
        throw error;
    }
}

// retrieve-all-products [ admin only ]
module.exports.getAllProducts = () => {
  return Product.find({}, '-__v').then((result) => {
    return result;
  });
};

// retrieve-all-products [ admin only ]
module.exports.updateProduct = async (productId, productUpdate) => {
  try {

    const updatedProduct = {
      name: productUpdate.name,
      sku: productUpdate.sku,
      description: productUpdate.description,
      price: productUpdate.price,
      imageLinks: productUpdate.imageLinks,
    };

    const result = await Product.findByIdAndUpdate(productId, updatedProduct);

    if (!result) {
      throw new Error('Product not found or update failed.');
    }

    return { message: 'Product successfully updated.' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while updating the product.' };
  }
};

// archive-product [ admin-only ]
module.exports.archiveProduct = async (product_id) => {
  try {
    // Find the product by ID
    const product = await Product.findById(product_id);

    if (!product) {
      throw new Error('Product not found.');
    }

    // Toggle the isActive field
    product.isActive = !product.isActive;

    // Save the updated product
    const updatedProduct = await product.save();

    if (!updatedProduct) {
      throw new Error('Product update failed.');
    }

    // Determine the message based on the isActive field
    let message = '';
    if (product.isActive) {
      message = 'Product has been activated.';
    } else {
      message = 'Product has been archived.';
    }

    return { message };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while archiving the product.' };
  }
};
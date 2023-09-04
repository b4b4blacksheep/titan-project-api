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
    throw error; // Rethrow the error to be handled by the caller
  }
};

// retrieve-single-product
module.exports.getProduct = (product_id) => {
  return Product.findById(product_id)
    .select('-orders -__v')
    .where({ isActive: true }) // Add a condition to only return active products
    .then((result) => {
      return result;
    });
};

// retrieve-all-products [ admin only ]
module.exports.getAllProducts = () => {
  return Product.find({}, '-__v').then((result) => {
    return result;
  });
};


// retrieve-all-products [ admin only ]
module.exports.updateProduct = async (product_id, product_update) => {
  try {

    const updatedProduct = {
      name: product_update.name,
      sku: product_update.sku,
      description: product_update.description,
      price: product_update.price,
      imageLinks: product_update.imageLinks,
    };

    const result = await Product.findByIdAndUpdate(product_id, updatedProduct);

    if (!result) {
      throw new Error('Product not found or update failed.');
    }

    return { message: 'Product successfully updated.' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while updating the product.' };
  }
};





// Not yet done!

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
const Product = require('../models/Product');
const User = require('../models/User');

const cache = {};

const addProduct = async (newProduct) => {
  try {
    // Create a new Product using the model and newProduct object passed as parameter
    const product = new Product({
      name: newProduct.name,
      brand: newProduct.brand,
      color: newProduct.color,
      sku: newProduct.sku,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      status: newProduct.status,
      isActive: newProduct.isActive || true,
      isArchived: newProduct.isArchived || false,
      isOnSale: newProduct.isOnSale || false,
      onSaleValue: newProduct.onSaleValue || 0,
      imageLinks: newProduct.imageLinks,
      sizes: newProduct.sizes,
      // createdOn will be automatically set based on your schema
    });

    await product.save();  // Save the new product to the database

    // Invalidate the cache
    delete cache['activeProducts'];
  } catch (error) {
    throw error;  // Propagate the error so it can be handled upstream
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
      brand: productData.brand,
      color: productData.color,
      sku: productData.sku,
      description: productData.description,
      price: productData.price,
      imageLinks: productData.imageLinks,
      status: productData.status,
      sizes: productData.sizes,
      category: productData.category,
      isOnSale: productData.isOnSale,
      onSaleValue: productData.onSaleValue,
      
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
// module.exports.retrieveAllActive = async () => {
//   try {
//     return await Product.find({ isActive: true }, { __v: 0, createdOn: 0, isActive: 0, orders: 0 }).sort({ _id: -1 });
//   } catch (error) {
//     throw error;
//   }
// };
module.exports.retrieveAllActive = async () => {
  // First check if the data exists in cache
  if (cache['activeProducts']) {
    console.log("Serving from cache");
    return cache['activeProducts'];
  }

  try {
    const products = await Product.find({ isActive: true }, { __v: 0, createdOn: 0, isActive: 0, orders: 0 }).sort({ _id: -1 });
    // Save the data to cache before returning
    cache['activeProducts'] = products;
    return products;
  } catch (error) {
    throw error;
  }
};

  // Footwear
module.exports.retrieveAllActiveFootwear = async () => {
  try {
    return await Product.find(
      { 
          isActive: true,
          category: "Footwear"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveNonActiveFootwear = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          category: "Footwear"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveArchivedFootwear = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          isArchived: true,
          category: "Footwear"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

  // Apparel
module.exports.retrieveAllActiveApparel = async () => {
  try {
    return await Product.find(
      { 
          isActive: true,
          category: "Apparel"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveNonActiveApparel = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          category: "Apparel"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveArchivedApparel = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          isArchived: true,
          category: "Apparel"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

  // Accessories
module.exports.retrieveAllActiveAccessories = async () => {
  try {
    return await Product.find(
      { 
          isActive: true,
          category: "Accessories"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveNonActiveAccessories = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          category: "Accessories"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveArchivedAccessories = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          isArchived: true,
          category: "Accessories"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

  // Accessories
module.exports.retrieveAllActiveAccessories = async () => {
  try {
    return await Product.find(
      { 
          isActive: true,
          category: "Accessories"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveNonActiveAccessories = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          category: "Accessories"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveArchivedAccessories = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          isArchived: true,
          category: "Accessories"

      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

  // Shop-All
module.exports.retrieveAllActiveAll = async () => {
  try {
    return await Product.find(
      { 
          isActive: true
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveNonActiveAll = async () => {
  try {
    return await Product.find(
      { 
          isActive: false
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

module.exports.retrieveArchivedAll = async () => {
  try {
    return await Product.find(
      { 
          isActive: false,
          isArchived: true,
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
}

// new-products
module.exports.retrieveNewProducts = async () => {
  try {
    return await Product.find(
      { 
        isActive: true,
        isOnSale: false
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
};


// shopAll
module.exports.retriveShopAll = async () => {
  try {
    let products = await Product.find(
      { 
        isActive: true,
        isOnSale: false
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    );

    // Custom sorting in JavaScript
    const customOrder = ['Heat', 'Rare', 'Stock', 'Others'];
    products = products.sort((a, b) => {
      return customOrder.indexOf(a.status) - customOrder.indexOf(b.status);
    });

    return products;

  } catch (error) {
    throw error;
  }
};


// onSale-products
// module.exports.retrieveOnSale = async () => {
//   try {
//     return await Product.find(
//       { 
//         isActive: true,
//         isOnSale: true
//       },
//       {
//         __v: 0,
//         createdOn: 0,
//         isActive: 0,
//         orders: 0
//       }
//     ).sort({ _id: -1 });
//   } catch (error) {
//     throw error;
//   }
// };
module.exports.retrieveOnSale = async () => {
  try {
    const products = await Product.find(
      {
        isActive: true,
        isOnSale: true
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    );
    
    return shuffleArray(products);
  } catch (error) {
    throw error;
  }
};

// footwear-products
module.exports.retrieveFootwear = async () => {
  try {
    return await Product.find(
      { 
          isActive: true,
          category: 'Footwear'
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
};

// footwear-products [ admin-only ]
module.exports.retrieveFootwearAdmin = async () => {
  try {
    return await Product.find(
      { 
          category: 'Footwear'
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
};

// apparel-products
module.exports.retrieveApparel = async () => {
  try {
    return await Product.find(
      { 
          isActive: true,
          category: 'Apparel'
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
  } catch (error) {
    throw error;
  }
};

// accessories-products
module.exports.retrieveAccessories = async () => {
  try {
    return await Product.find(
      { 
          isActive: true,
          category: 'Accessories' || 'accessories'
      },
      {
        __v: 0,
        createdOn: 0,
        isActive: 0,
        orders: 0
      }
    ).sort({ _id: -1 });
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

// update-product [ admin only ]
module.exports.updateProduct = async (productId, productUpdate) => {
  try {

    const updatedProduct = {
      name: productUpdate.name,
      brand: productUpdate.brand,
      color: productUpdate.color,
      sku: productUpdate.sku,
      description: productUpdate.description,
      price: productUpdate.price,
      imageLinks: productUpdate.imageLinks,
      isOnSale: productUpdate.isOnSale,
      onSaleValue: productUpdate.onSaleValue,
      status: productUpdate.status
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
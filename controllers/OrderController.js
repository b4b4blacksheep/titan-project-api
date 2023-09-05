const bcrypt = require('bcrypt')
const auth = require('../auth')

const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')

// create-order [ user-only ]
module.exports.createOrder = async (data) => {
  try {

    if (data.isAdmin) {
      return { message: "This is an ADMIN account, invalid request." };
    }

    // Validate if data.products is an array
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('Invalid products data: An array of products is required.');
    }

    let totalAmount = 0;

    // Calculate totalAmount by iterating through products
    for (const product of data.products) {
      const { quantity, price } = product;

      // Validate that quantity and price are valid numbers
      if (isNaN(quantity) || isNaN(price)) {
        throw new Error('Invalid quantity or price: Not a number.');
      }

      totalAmount += quantity * price;
    }

    const new_order = new Order({
      userId: data.userId,
      products: data.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: totalAmount,
    });

    const updated_order = await new_order.save();

    if (!updated_order) {
      throw new Error('Order creation failed.');
    }

    return { message: 'Successful order created.' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while creating the order.' };
  }
};

// all-orders [ admin-only ]
module.exports.retrieveAllOrder = async () => {
  try {
    const result = await Order.aggregate([
      {
        $match: { isActive: true } // Filter for active orders
      },
      {
        $group: {
          _id: '$userId', // Group by userId
          orders: { $push: '$$ROOT' } // Collect orders into an array
        }
      }
    ]);

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error while retrieving consolidated orders.');
  }
};

// all-orders [ user-only ]
module.exports.userOrders = async (userId) => {
  try {
  	console.log(userId);

    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return { message: "No orders found!" };
    }

    return orders;
  } catch (error) {
    console.error(error);
    throw new Error('Error while retrieving user orders.');
  }
};
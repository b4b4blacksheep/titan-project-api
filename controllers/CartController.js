const auth = require('../auth');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart'); 

const mongoose = require('mongoose'); 

module.exports.addToCart = async (userId, data) => {
  try {
    // Check if a cart already exists for the user
    let existingCart = await Cart.findOne({ userId });

    if (!existingCart) {
      // Create a new cart for the user if it doesn't exist
      existingCart = new Cart({
        userId,
        items: [],
      });
    }

    // Iterate through the new items
    for (const newItem of data.items) {
      // Find an existing cart item with the same productId and size
      const existingItem = existingCart.items.find(
        (item) =>
          item.productId.toString() === newItem.productId &&
          item.size === newItem.size
      );

      if (existingItem) {
        // If the item already exists, update the quantity
        existingItem.quantity += newItem.quantity || 1; // Default to 1 if quantity is missing
      } else {
        // If the item doesn't exist, add it to the cart with a default quantity of 1
        existingCart.items.push({
          productId: mongoose.Types.ObjectId(newItem.productId),
          quantity: newItem.quantity || 1, // Default to 1 if quantity is missing
          size: newItem.size,
        });
      }
    }

    // Save the updated or newly created cart
    await existingCart.save();

    return { message: 'Cart updated successfully.' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while updating or creating the cart.' };
  }
};

module.exports.viewCart = async (userId) => {
  try {
    // Find the cart associated with the given userId
    const existingCart = await Cart.findOne({ userId })
      .populate('items.productId') // Optionally populate product details
      .exec();

    if (!existingCart) {
      return { message: 'No cart found for this user.' };
    }
  
    return existingCart;

  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while fetching the cart.' };
  }
};

module.exports.removeItemCart = async (userId, cartId) => {
  try {
    // Find the cart associated with the given userId
    const existingCart = await Cart.findOne({ userId })
      .populate('items.productId') // Optionally populate product details
      .exec();

    if (!existingCart) {
      return { message: 'No cart found for this user.' };
    }

    // Filter out the item that matches the cartId
    existingCart.items = existingCart.items.filter(item => String(item._id) !== String(cartId));

    // Save the updated cart
    await existingCart.save();

    console.log(existingCart)
    return { message: `Item with cartId ${cartId} has been removed.` };

  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while removing the item from the cart.' };
  }
};


const auth = require('../auth');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart'); 

const mongoose = require('mongoose'); 

module.exports.addToCart = async (userId, data) => {
  try {

    const newCartData = new Cart({
    	items: data.items.map(item => ({
    		productId: mongoose.Types.ObjectId(item.productId),
    		quantity: item.quantity,
    		size: item.size,
    	}))
    });

    const created_cart = await newCartData.save();

    return { message: 'Successfully added to cart.' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while adding to the cart.' };
  }
};
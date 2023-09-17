const mongoose = require('mongoose');

const cart_schema = new mongoose.Schema({
  items: [ 
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
      },
      quantity: {
        type: Number,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      }
    }
  ]
});

module.exports = mongoose.model('Cart', cart_schema);
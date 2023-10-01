const mongoose = require('mongoose');

const cart_schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
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
        default: 0
      },
      size: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('Cart', cart_schema);
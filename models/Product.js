const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."]
  },
  sku: {
    type: String,
    required: [true, "SKU is required."]
  },
  description: {
    type: String,
    required: [true, "Description is required."]
  },
  price: {
    type: Number,
    required: [true, "Price is required."]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: new Date()
  },
  imageLinks: [
    {
      type: String,
      required: [true, "Image Link is required."]
    }
  ],
  orders: [
    {
      orderId: {
        type: String,
        required: [true, 'OrderId is Required.']
      },
      orderedOn: {
        type: Date,
        default: new Date()
      }
    }
  ]
});

module.exports = mongoose.model('Product', productSchema);
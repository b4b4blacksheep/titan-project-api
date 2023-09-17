const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: [true, 'This field is required.']
};

const requiredNumber = {
  type: Number,
  required: [true, 'This field is required.']
};

const sizesSchema = new mongoose.Schema({
  size: requiredString,
  quantity: requiredNumber
});

const productSchema = new mongoose.Schema({
  // Basic information
  name: requiredString,
  brand: requiredString,
  color: requiredString,
  sku: requiredString,
  description: requiredString,
  
  // Pricing and Category
  price: {...requiredNumber, min: 0},
  category: requiredString,
  
  // Product status
  status: requiredString,
  isActive: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Sale Information
  isOnSale: {
    type: Boolean,
    default: false
  },
  onSaleValue: {
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Metadata
  createdOn: {
    type: Date,
    default: new Date()
  },
  
  // Media and Size
  imageLinks: [{
    type: String,
    required: [true, "Image Link is required."]
  }],
  sizes: {
    type: [sizesSchema],
    required: [true, "Size is required."]
  }
});

module.exports = mongoose.model('Product', productSchema);

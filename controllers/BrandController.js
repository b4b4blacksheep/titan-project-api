const Product = require('../models/Product')

const brands = [
  {name: 'Adidas', variants: ['Adidas', 'ADIDAS']},
  {name: 'Anta', variants: ['Anta', 'ANTA']},
  {name: 'Jordan', variants: ['Jordan', 'JORDAN']},
  {name: 'Mitchell & Ness', variants: ['Mitchell & Ness', 'MITCHELL & NESS']},
  {name: 'New Era', variants: ['New Era', 'NEW ERA']},
  {name: 'Nike', variants: ['Nike', 'NIKE']},
  {name: 'Nike NBA', variants: ['Nike NBA', 'NIKE NBA']},
  {name: 'Nike Sportswear', variants: ['Nike Sportswear', 'NIKE SPORTSWEAR']},
  {name: 'Puma', variants: ['Puma', 'PUMA']},
  {name: 'Slam', variants: ['Slam', 'SLAM']},
  {name: 'Titan', variants: ['Titan', 'TITAN']}
];

const customSortOrder = {
  "rare": 1,
  "hot": 2,
  "stock": 3,
  "sale": 4
};

brands.forEach(({name, variants}) => {
  const methodName = 'retrieve' + name.replace(/&| |-/g, '');
  
  module.exports[methodName] = async () => {
    try {
      // Fetch the products from the database
      const products = await Product.find(
        {
          isActive: true,
          brand: {
            $in: variants
          }
        },
        { __v: 0, createdOn: 0, isActive: 0, orders: 0 }
      );

      // Sort the products manually
      const sortedProducts = products.sort((a, b) => {
        return customSortOrder[a.status] - customSortOrder[b.status];
      });

      // Return the sorted products
      return sortedProducts;
    } catch (error) {
      throw error;
    }
  };
});


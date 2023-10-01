const express = require('express')
const router = express.Router()

const BrandController = require('../controllers/BrandController')

const brands = [
  'Adidas',
  'Anta',
  'Jordan',
  'MitchellNess',
  'New Era',
  'Nike',
  'Nike NBA',
  'Nike Sportswear',
  'Puma',
  'Slam',
  'Titan'
];

brands.forEach(brand => {
  const routeName = brand.toLowerCase().replace(/&| /g, '');
  const methodName = 'retrieve' + brand.replace(/&| |-/g, '');

  router.get(`/${routeName}`, async (request, response) => {
    try {
      const result = await BrandController[methodName]();
      response.status(200).send(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
});



module.exports = router
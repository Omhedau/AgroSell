const express = require('express');
const { addProduct } = require('../controllers/productController');
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post('/',validateToken, addProduct);

module.exports = router;
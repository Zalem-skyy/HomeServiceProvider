const express = require('express');
const router = express.Router();
const providerController = require('./providerController');

// GET /api/providers/categories
router.get('/categories', providerController.getCategories);

// GET /api/providers/category/:category
router.get('/category/:category', providerController.getProvidersByCategory);

// New Auth Routes
router.post('/register', providerController.register);
router.post('/login', providerController.login);

module.exports = router;
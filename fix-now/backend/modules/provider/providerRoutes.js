const express = require('express');
const router = express.Router();
const providerController = require('./providerController');

// GET /api/providers/categories
router.get('/categories', providerController.getCategories);

module.exports = router;
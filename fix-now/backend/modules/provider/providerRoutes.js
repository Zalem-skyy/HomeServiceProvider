const express = require('express');
const router = express.Router();
const providerController = require('./providerController');

router.get('/categories', providerController.getCategories);
// GET /api/providers/user/:userId
router.get('/user/:userId', providerController.getProviderProfile);
router.get('/category/:category', providerController.getProvidersByCategory);
router.get('/search', providerController.searchProviders);

// New unified route for a user becoming a provider
router.post('/become', providerController.becomeProvider);

module.exports = router;
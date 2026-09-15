const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

router.get('/providers/unverified', adminController.getUnverifiedProviders);
router.patch('/providers/:id/verify', adminController.verifyProvider);

module.exports = router;
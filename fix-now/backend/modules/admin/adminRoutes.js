const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

// GET /api/admin/providers/pending
router.get('/providers/pending', adminController.getPendingProviders);

// PATCH /api/admin/providers/:id/approve
router.patch('/providers/:id/approve', adminController.approveProvider);

module.exports = router;
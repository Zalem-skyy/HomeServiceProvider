const express = require('express');
const router = express.Router();
const reviewController = require('./reviewController');

// POST /api/reviews
router.post('/', reviewController.submitReview);

module.exports = router;
const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');

router.patch('/:id/pay', paymentController.processPayment);
module.exports = router;

const express = require('express');
const router = express.Router();
const bookingController = require('./bookingController');

// POST /api/bookings
router.post('/', bookingController.createBooking);
// GET /api/bookings/active/:userId
router.get('/active/:userId', bookingController.getUserActiveBooking);
module.exports = router;

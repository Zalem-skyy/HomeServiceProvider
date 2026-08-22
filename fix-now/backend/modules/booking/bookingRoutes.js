const express = require('express');
const router = express.Router();
const bookingController = require('./bookingController');

// POST /api/bookings
router.post('/', bookingController.createBooking);

// GET /api/bookings/user/:userId - Get all bookings for a user
router.get('/user/:userId', bookingController.getAllUserBookings);

// GET /api/bookings/:id - Get specific booking details
router.get('/:id', bookingController.getBookingById);

// GET /api/bookings/active/:userId
router.get('/active/:userId', bookingController.getUserActiveBooking);

module.exports = router;

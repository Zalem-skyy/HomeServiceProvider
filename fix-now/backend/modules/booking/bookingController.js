const db = require('../../config/db');

exports.createBooking = async (req, res) => {
    try {
        const { userId, providerId, date } = req.body;

        if (!userId || !providerId || !date) {
            return res.status(400).json({ message: 'Missing booking details.' });
        }

        const [result] = await db.query(
            "INSERT INTO bookings (user_id, provider_id, appointment_date, status) VALUES (?, ?, ?, 'pending')",
            [userId, providerId, date]
        );

        res.status(201).json({ message: 'Booking confirmed!', bookingId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating booking.' });
    }
};

// Fetch ALL bookings for a specific user
exports.getAllUserBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.id, b.appointment_date, b.status, u.name AS provider_name 
             FROM bookings b 
             JOIN providers p ON b.provider_id = p.id 
             JOIN users u ON p.user_id = u.id
             WHERE b.user_id = ? ORDER BY b.appointment_date ASC`,
            [req.params.userId]
        );
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bookings.' });
    }
};

// Fetch details for a SINGLE booking
exports.getBookingById = async (req, res) => {
    try {
        const [booking] = await db.query(
            `SELECT b.*, u.name AS provider_name, p.service_category 
             FROM bookings b 
             JOIN providers p ON b.provider_id = p.id 
             JOIN users u ON p.user_id = u.id
             WHERE b.id = ?`,
            [req.params.id]
        );
        res.status(200).json(booking[0] || {});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching booking details.' });
    }
};

// Fetch the most recent active booking for a user
exports.getUserActiveBooking = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const [bookings] = await db.query(
            `SELECT b.id, b.appointment_date, b.status, u.name AS provider_name 
             FROM bookings b 
             JOIN providers p ON b.provider_id = p.id 
             JOIN users u ON p.user_id = u.id 
             WHERE b.user_id = ? AND b.status = 'pending' 
             ORDER BY b.id DESC LIMIT 1`,
            [userId]
        );

        if (bookings.length === 0) return res.status(200).json({ hasBooking: false });
        res.status(200).json({ hasBooking: true, booking: bookings[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching active booking.' });
    }
};
// Cancel a specific booking
exports.cancelBooking = async (req, res) => {
    try {
        const [result] = await db.query(
            "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cancelling booking.' });
    }
};

// Fetch ALL bookings for a specific provider
exports.getProviderBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.id, b.appointment_date, b.status, u.name AS user_name 
             FROM bookings b 
             JOIN users u ON b.user_id = u.id 
             WHERE b.provider_id = ? 
             ORDER BY b.appointment_date ASC`,
            [req.params.providerId]
        );
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching provider bookings.' });
    }
};
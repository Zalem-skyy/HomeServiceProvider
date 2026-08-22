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
// Fetch the most recent active booking for a user
exports.getUserActiveBooking = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Join bookings and providers tables to get the provider's name
        const [bookings] = await db.query(
            `SELECT b.id, b.appointment_date, b.status, p.name AS provider_name 
             FROM bookings b 
             JOIN providers p ON b.provider_id = p.id 
             WHERE b.user_id = ? AND b.status = 'pending' 
             ORDER BY b.appointment_date ASC LIMIT 1`,
            [userId]
        );

        if (bookings.length === 0) {
            return res.status(200).json({ hasBooking: false });
        }

        res.status(200).json({ hasBooking: true, booking: bookings[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching active booking.' });
    }
};
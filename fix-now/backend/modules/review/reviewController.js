const db = require('../../config/db');

exports.submitReview = async (req, res) => {
    try {
        const { bookingId, rating, feedback } = req.body;

        if (!bookingId || !rating) {
            return res.status(400).json({ message: 'Booking ID and rating are required.' });
        }

        // Verify the booking is actually completed
        const [booking] = await db.query('SELECT status FROM bookings WHERE id = ?', [bookingId]);
        if (booking.length === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        if (booking[0].status !== 'completed') {
            return res.status(400).json({ message: 'You can only review completed jobs.' });
        }

        // Insert the review
        await db.query(
            'INSERT INTO reviews (booking_id, rating, feedback) VALUES (?, ?, ?)',
            [bookingId, rating, feedback || '']
        );

        res.status(201).json({ message: 'Review submitted successfully!' });
    } catch (error) {
        // Handle duplicate entries (one review per booking)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'You have already reviewed this booking.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error submitting review.' });
    }
};

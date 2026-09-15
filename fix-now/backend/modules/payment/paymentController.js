const db = require('../../config/db');

// Fake the transaction and update status
exports.processPayment = async (req, res) => {
    try {
        const [result] = await db.query(
            "UPDATE bookings SET status = 'paid' WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Booking not found.' });
        
        res.status(200).json({ message: 'Payment successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment.' });
    }
};

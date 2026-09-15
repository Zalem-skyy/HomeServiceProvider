const db = require('../../config/db');

// Fetch all providers waiting for approval (Updated with JOIN)
exports.getPendingProviders = async (req, res) => {
    try {
        const [providers] = await db.query(
            `SELECT p.id, u.name, u.email, p.service_category, p.location 
             FROM providers p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.is_verified = false`
        );
        res.status(200).json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pending providers.' });
    }
};

// Approve a specific provider profile
exports.approveProvider = async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE providers SET is_verified = true WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Provider profile not found.' });
        
        res.status(200).json({ message: 'Provider profile approved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error approving provider.' });
    }
};
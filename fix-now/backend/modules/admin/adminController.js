const db = require('../../config/db');

// Get all unverified providers
exports.getUnverifiedProviders = async (req, res) => {
	try {
		const [providers] = await db.query(
			'SELECT id, name, email, service_category, location FROM providers WHERE is_verified = false'
		);
		res.status(200).json(providers);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching unverified providers.' });
	}
};

// Verify a provider
exports.verifyProvider = async (req, res) => {
	try {
		const [result] = await db.query(
			'UPDATE providers SET is_verified = true WHERE id = ?',
			[req.params.id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Provider not found.' });
		}
		res.status(200).json({ message: 'Provider verified successfully.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error verifying provider.' });
	}
};

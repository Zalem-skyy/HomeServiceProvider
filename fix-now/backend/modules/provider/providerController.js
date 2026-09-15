const db = require('../../config/db');

// 1. Fetch available service categories
exports.getCategories = async (req, res) => {
    try {
        const categories = [
            { id: 1, name: 'Plumbers' }, { id: 2, name: 'Electricians' },
            { id: 3, name: 'Cleaners' }, { id: 4, name: 'Carpenters' },
            { id: 5, name: 'Painters' }, { id: 6, name: 'Appliances' },
            { id: 7, name: 'Pest Control' }, { id: 8, name: 'Movers' }
        ];
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories.' });
    }
};

// 2. Upgrade an existing User to a Provider
exports.becomeProvider = async (req, res) => {
    try {
        const { userId, service_category, location } = req.body;
        
        // Safety check to prevent mysql2 fatal crash
        if (!userId) return res.status(400).json({ message: 'Invalid User ID. Please log in again.' });

        // Check if this user already has a provider profile
        const [existing] = await db.query('SELECT * FROM providers WHERE user_id = ?', [userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'You are already registered as a provider.' });
        }

        // Insert into providers table linked by user_id
        await db.query(
            'INSERT INTO providers (user_id, service_category, location, is_verified) VALUES (?, ?, ?, false)',
            [userId, service_category, location || 'New York']
        );
        
        res.status(201).json({ message: 'Provider profile created! Pending admin approval.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating provider profile.' });
    }
};

// 3. Fetch providers by category
exports.getProvidersByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        
        const [providers] = await db.query(
            `SELECT p.id, u.name, p.service_category, p.location 
             FROM providers p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.service_category = ? AND p.is_verified = true`,
            [category]
        );
        
        res.status(200).json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching providers.' });
    }
};

// 4. Search providers by keyword and location
exports.searchProviders = async (req, res) => {
    try {
        const { keyword, location } = req.query;
        let query = `SELECT p.id, u.name, p.service_category, p.location 
                     FROM providers p 
                     JOIN users u ON p.user_id = u.id 
                     WHERE p.is_verified = true`;
        const params = [];

        if (keyword) {
            query += ' AND (p.service_category LIKE ? OR u.name LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        if (location) {
            query += ' AND p.location = ?';
            params.push(location);
        }

        const [providers] = await db.query(query, params);
        res.status(200).json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching providers.' });
    }
};
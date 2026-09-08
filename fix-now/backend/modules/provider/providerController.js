const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fetch available service categories
exports.getCategories = async (req, res) => {
    try {
        // We are using a static array for the prototype UI. 
        // Later, this can be: await db.query('SELECT DISTINCT service_category FROM providers');
        const categories = [
            { id: 1, name: 'Plumbers' },
            { id: 2, name: 'Electricians' },
            { id: 3, name: 'Cleaners' },
            { id: 4, name: 'Carpenters' },
            { id: 5, name: 'Painters' },
            { id: 6, name: 'Appliances' },
            { id: 7, name: 'Pest Control' },
            { id: 8, name: 'Movers' }
        ];
        
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories.' });
    }
};

// Register a new Provider
exports.register = async (req, res) => {
    try {
        const { name, email, password, service_category } = req.body;
        
        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert into database (setting is_verified to true for our prototype)
        await db.query(
            'INSERT INTO providers (name, email, password, service_category, is_verified) VALUES (?, ?, ?, ?, true)',
            [name, email, hashedPassword, service_category]
        );
        
        res.status(201).json({ message: 'Provider registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering provider.' });
    }
};

// Login an existing Provider
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find provider by email
        const [providers] = await db.query('SELECT * FROM providers WHERE email = ?', [email]);
        
        // Check if provider exists and password matches
        if (providers.length === 0 || !(await bcrypt.compare(password, providers[0].password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT (Notice the role is set to 'provider'!)
        const token = jwt.sign(
            { id: providers[0].id, role: 'provider' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ message: 'Login successful!', token, provider: providers[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Fetch providers by category
exports.getProvidersByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        
        // Fetch verified providers in the requested category
        const [providers] = await db.query(
            'SELECT id, name, service_category FROM providers WHERE service_category = ? AND is_verified = true',
            [category]
        );
        
        res.status(200).json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching providers.' });
    }
};

// Search providers by keyword and location
exports.searchProviders = async (req, res) => {
    try {
        const { keyword, location } = req.query;
        let query = 'SELECT id, name, service_category, location FROM providers WHERE is_verified = true';
        const params = [];

        if (keyword) {
            query += ' AND (service_category LIKE ? OR name LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        if (location) {
            query += ' AND location = ?';
            params.push(location);
        }

        const [providers] = await db.query(query, params);
        res.status(200).json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching providers.' });
    }
};
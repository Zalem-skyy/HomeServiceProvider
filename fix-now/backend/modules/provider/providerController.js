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
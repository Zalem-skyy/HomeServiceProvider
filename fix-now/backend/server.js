const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize DB connection
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Fix Now API is running smoothly' });
});

// Import Module Routes
const userRoutes = require('./modules/user/userRoutes');
const providerRoutes = require('./modules/provider/providerRoutes');
const bookingRoutes = require('./modules/booking/bookingRoutes');
const paymentRoutes = require('./modules/payment/paymentRoutes');
const reviewRoutes = require('./modules/review/reviewRoutes');
const adminRoutes = require('./modules/admin/adminRoutes');

// Mount Module Routes
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bookings', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
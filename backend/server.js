const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));

// Test route
app.get('/', (req, res) => {
    res.json({ message: ' Bus Tracking API is running!' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(' MongoDB connected successfully'))
    .catch(err => {
        console.error(' MongoDB connection failed:', err);
        process.exit(1);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Test URL: http://localhost:${PORT}`);
});
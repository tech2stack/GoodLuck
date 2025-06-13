require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // To allow cross-origin requests from your frontend
const { centralDbConnection } = require('./config/db'); // Import DB connection function
const setupRoutes = require('./routes/index'); // Import centralized route setup

const app = express();

// --- Connect to the central database ---
// This connection will handle the SuperAdmin and Branch models
centralDbConnection.on('connected', () => {
    console.log(`Central MongoDB connected: ${centralDbConnection.host} (DB: ${centralDbConnection.name})`);
});

centralDbConnection.on('error', (err) => {
    console.error(`Central MongoDB connection error: ${err.message}`);
    process.exit(1);
});


// --- Middleware ---
app.use(express.json()); // Body parser for JSON data (to read data sent in request body)

// CORS Configuration Update:
// Wildcard '*' is not allowed with 'credentials: true'.
// Therefore, you must allow a specific origin.
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL (where your React app is running)
    credentials: true, // Allow cookies (HttpOnly JWT)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions)); // Configure CORS middleware

// --- Register global models with the central DB connection ---
// These models will always use the central database
const SuperAdmin = centralDbConnection.model('SuperAdmin', require('./models/SuperAdmin').schema); // SuperAdmin model
const Employee = centralDbConnection.model('Employee', require('./models/Employee').schema); // Employee model (not used yet)
const Branch = centralDbConnection.model('Branch', require('./models/Branch').schema); // Branch model

// Pass models to the routes setup function
const models = { SuperAdmin, Employee, Branch }; // Include SuperAdmin in models

// --- Routes ---
app.get('/', (req, res) => {
    res.send('Library Admin Backend is running! Central DB is connected.');
});

setupRoutes(app, models); // Call function to set up all routes, passing models

// --- Error handling middleware (to be created later) ---
// If you want to use a global error handler, define it here after all routes
// const { errorHandler } = require('./middleware/errorHandler');
// app.use(errorHandler);

const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

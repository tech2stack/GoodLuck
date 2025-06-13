// routes/index.js
const authRoutes = require('./auth');
const branchRoutes = require('./branchRoutes');
const employeeRoutes = require('./employeeRoutes');
const branchAdminRoutes = require('./branchAdminRoutes');

// Export a function that accepts the Express app instance and models
const setupRoutes = (app, models) => {
    // Pass models to authRoutes setup
    app.use('/api/v1/auth', authRoutes(models));

    // Mount branch-related routes
    app.use('/api/v1/branches', branchRoutes(models));

    // Mount employee-related routes
    app.use('/api/v1/employees', employeeRoutes(models));

    app.use('/api/v1/branch-admins', branchAdminRoutes(models));
};

module.exports = setupRoutes;

// routes/auth.js
const express = require('express');
const authController = require('../controllers/authController'); 

const router = express.Router();

module.exports = (models) => {
    router.post('/login', authController.login(models)); 
    router.post('/register-super-admin', authController.registerSuperAdmin(models)); 

    return router;
};

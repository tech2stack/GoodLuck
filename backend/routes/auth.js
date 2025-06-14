// backend/routes/auth.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register-super-admin', authController.registerSuperAdmin);
router.get('/logout', authController.logout);

module.exports = router;
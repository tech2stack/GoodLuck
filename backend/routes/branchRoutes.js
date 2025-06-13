// routes/branchRoutes.js
const express = require('express');
const branchController = require('../controllers/branchController'); // Import the controller
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

const router = express.Router();

module.exports = (models) => {
    // FIX: Call branchController with models to get the object of controller methods
    const controllerMethods = branchController(models);

    router.route('/')
        // Use the methods from the controllerMethods object
        .post(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.createBranch)
        .get(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.getAllBranches);

    router.route('/:id')
        .get(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.getBranch)
        .patch(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.updateBranch)
        .delete(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.deleteBranch);

    return router;
};

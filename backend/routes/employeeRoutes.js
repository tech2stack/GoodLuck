// routes/employeeRoutes.js
const express = require('express');
const employeeController = require('../controllers/employeeController'); 
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

module.exports = (models) => {
    router.route('/')
        .post(authMiddleware.protect(models), authMiddleware.restrictTo('branch_admin', 'super_admin'), employeeController.createEmployee(models)) 
        .get(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin', 'branch_admin'), employeeController.getAllEmployees(models)); 

    router.route('/:id')
        .get(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin', 'branch_admin', 'employee'), employeeController.getEmployee(models)) 
        .patch(authMiddleware.protect(models), authMiddleware.restrictTo('branch_admin', 'super_admin'), employeeController.updateEmployee(models)) 
        .delete(authMiddleware.protect(models), authMiddleware.restrictTo('branch_admin', 'super_admin'), employeeController.deleteEmployee(models)); 

    return router;
};

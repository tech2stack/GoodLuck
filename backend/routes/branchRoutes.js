const express = require('express');
const branchController = require('../controllers/branchController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(authMiddleware.protect, authMiddleware.restrictTo('super_admin'), branchController.createBranch)
    .get(authMiddleware.protect, authMiddleware.restrictTo('super_admin', 'branch_admin', 'employee'), branchController.getAllBranches);

router.route('/:id') // <-- This path is crucial. It must be exactly ':id'
    .get(authMiddleware.protect, authMiddleware.restrictTo('super_admin', 'branch_admin', 'employee'), branchController.getBranch)
    .patch(authMiddleware.protect, authMiddleware.restrictTo('super_admin'), branchController.updateBranch) // <-- Ensure .patch is here and points to updateBranch
    .delete(authMiddleware.protect, authMiddleware.restrictTo('super_admin'), branchController.deleteBranch);

module.exports = router;
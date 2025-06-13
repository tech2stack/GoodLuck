// routes/branchAdminRoutes.js
const express = require('express');
const branchAdminController = require('../controllers/branchAdminController'); // कंट्रोलर इम्पोर्ट करें
const authMiddleware = require('../middleware/authMiddleware'); // मिडलवेयर इम्पोर्ट करें

const router = express.Router();

module.exports = (models) => {
    // **यहाँ बदलाव है:**
    // branchAdminController एक फ़ंक्शन है जो कंट्रोलर मेथड्स का ऑब्जेक्ट लौटाता है।
    // उसे यहाँ models के साथ कॉल करें ताकि आप उसके मेथड्स का उपयोग कर सकें।
    const controllerMethods = branchAdminController(models);

    router.route('/')
        .post(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.createBranchAdmin) // <-- यहाँ controllerMethods.createBranchAdmin का उपयोग करें
        .get(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.getAllBranchAdmins); // <-- यहाँ controllerMethods.getAllBranchAdmins का उपयोग करें

    router.route('/:id')
        .get(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.getBranchAdmin) // <-- यहाँ controllerMethods.getBranchAdmin का उपयोग करें
        .patch(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.updateBranchAdmin) // <-- यहाँ controllerMethods.updateBranchAdmin का उपयोग करें
        .delete(authMiddleware.protect(models), authMiddleware.restrictTo('super_admin'), controllerMethods.deleteBranchAdmin); // <-- यहाँ controllerMethods.deleteBranchAdmin का उपयोग करें

    return router;
};
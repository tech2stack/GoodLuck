// controllers/branchAdminController.js
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = (models) => {
    const { BranchAdmin, Branch } = models; // Branch मॉडल भी इम्पोर्ट करें

    // नया ब्रांच एडमिन बनाएं
    const createBranchAdmin = catchAsync(async (req, res, next) => {
        const { name, email, password, branchId } = req.body;

        if (!name || !email || !password || !branchId) {
            return next(new AppError('कृपया नाम, ईमेल, पासवर्ड और शाखा ID प्रदान करें।', 400));
        }

        // सुनिश्चित करें कि शाखा मौजूद है
        const branchExists = await Branch.findById(branchId);
        if (!branchExists) {
            return next(new AppError('प्रदान की गई शाखा ID मौजूद नहीं है।', 404));
        }

        const newAdmin = await BranchAdmin.create({ name, email, password, branchId, role: 'branch_admin' });

        res.status(201).json({
            status: 'success',
            data: {
                admin: newAdmin
            }
        });
    });

    // सभी ब्रांच एडमिन प्राप्त करें
    const getAllBranchAdmins = catchAsync(async (req, res, next) => {
        // branchId को पॉपुलेट करें ताकि शाखा का नाम दिख सके
        const admins = await BranchAdmin.find().populate({
            path: 'branchId',
            select: 'name' // केवल शाखा का नाम प्राप्त करें
        });
        res.status(200).json({
            status: 'success',
            results: admins.length,
            data: admins
        });
    });

    // अन्य CRUD फ़ंक्शन (get, update, delete) यहाँ जोड़ें,
    // सुनिश्चित करें कि वे भी branchId द्वारा फ़िल्टरिंग या पॉपुलेशन को संभालते हैं यदि आवश्यक हो।

    const getBranchAdmin = catchAsync(async (req, res, next) => {
        const admin = await BranchAdmin.findById(req.params.id).populate({
            path: 'branchId',
            select: 'name'
        });
        if (!admin) return next(new AppError('इस आईडी वाला कोई एडमिन नहीं मिला।', 404));
        res.status(200).json({ status: 'success', data: { admin } });
    });

    const updateBranchAdmin = catchAsync(async (req, res, next) => {
        const updatedAdmin = await BranchAdmin.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedAdmin) return next(new AppError('इस आईडी वाला कोई एडमिन नहीं मिला जिसे अपडेट किया जा सके।', 404));
        res.status(200).json({ status: 'success', data: { admin: updatedAdmin } });
    });

    const deleteBranchAdmin = catchAsync(async (req, res, next) => {
        const admin = await BranchAdmin.findByIdAndDelete(req.params.id);
        if (!admin) return next(new AppError('इस आईडी वाला कोई एडमिन नहीं मिला जिसे हटाया जा सके।', 404));
        res.status(204).json({ status: 'success', data: null });
    });

    return { createBranchAdmin, getAllBranchAdmins, getBranchAdmin, updateBranchAdmin, deleteBranchAdmin };
};
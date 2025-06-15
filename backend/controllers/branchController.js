const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Branch = require('../models/Branch');

exports.createBranch = catchAsync(async (req, res, next) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return next(new AppError('Please provide the branch name and location.', 400));
    }

    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
        return next(new AppError('A branch with this name already exists.', 409));
    }

    const newBranch = await Branch.create({
        name,
        location,
        createdBy: req.user._id,
        status: 'active'
    });

    res.status(201).json({
        success: true,
        message: 'Branch created successfully!',
        data: newBranch
    });
});

exports.getAllBranches = catchAsync(async (req, res, next) => {
    const branches = await Branch.find().populate({
        path: 'createdBy',
        select: 'name username'
    });

    res.status(200).json({
        success: true,
        count: branches.length,
        data: branches
    });
});

exports.getBranch = catchAsync(async (req, res, next) => {
    const branch = await Branch.findById(req.params.id).populate({
        path: 'createdBy',
        select: 'name username'
    });

    if (!branch) {
        return next(new AppError('No branch found with that ID.', 404));
    }

    res.status(200).json({
        success: true,
        data: branch
    });
});

exports.updateBranch = catchAsync(async (req, res, next) => {
    // We are only allowing name, location, and status to be updated via this form.
    // Ensure req.body only contains these fields or filter it.
    const allowedFields = {
        name: req.body.name,
        location: req.body.location,
        status: req.body.status,
        updatedAt: Date.now() // Update timestamp
    };

    // Filter out undefined values if a field wasn't provided in the request body
    Object.keys(allowedFields).forEach(key => {
        if (allowedFields[key] === undefined) {
            delete allowedFields[key];
        }
    });

    const branch = await Branch.findByIdAndUpdate(
        req.params.id,
        allowedFields, // Use the filtered allowedFields
        {
            new: true, // Return the modified document rather than the original
            runValidators: true // Run schema validators on update
        }
    );

    if (!branch) {
        return next(new AppError('No branch found with that ID to update.', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Branch updated successfully!',
        data: branch
    });
});

exports.deleteBranch = catchAsync(async (req, res, next) => {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
        return next(new AppError('No branch found with that ID to delete.', 404));
    }
    res.status(204).json({
        success: true,
        data: null
    });
});
// controllers/branchController.js
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = (models) => {
    // Access the Branch model from the passed models object
    const Branch = models.Branch;

    // --- Create Branch ---
    const createBranch = catchAsync(async (req, res, next) => {
        // Only destructure name and location from req.body
        // db_name is NO LONGER needed as we are using a single database.
        const { name, location } = req.body;

        // 1) Ensure all required fields (name and location) are present
        if (!name || !location) {
            return next(new AppError('Please provide the branch name and location.', 400));
        }

        // 2) Check if a branch with this name already exists in the central database
        const existingBranch = await Branch.findOne({ name });
        if (existingBranch) {
            return next(new AppError('A branch with this name already exists.', 409));
        }

        // 3) Create the new branch record in the central DB
        // req.user object comes from 'authMiddleware.protect' and contains SuperAdmin details
        const newBranch = await Branch.create({
            name,
            location,
            createdBy: req.user._id, // Store the ID of the Super Admin who created it
            status: 'active' // Default to active
        });

        res.status(201).json({
            success: true,
            message: 'Branch created successfully!',
            data: newBranch
        });
    });

    // --- Get All Branches ---
    const getAllBranches = catchAsync(async (req, res, next) => {
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

    // --- Get a Single Branch by ID ---
    const getBranch = catchAsync(async (req, res, next) => {
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

    // --- Update Branch ---
    const updateBranch = catchAsync(async (req, res, next) => {
        const { name, location, status } = req.body;

        const branch = await Branch.findByIdAndUpdate(
            req.params.id,
            { name, location, status, updatedAt: Date.now() },
            {
                new: true,
                runValidators: true
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

    // --- Delete Branch ---
    const deleteBranch = catchAsync(async (req, res, next) => {
        const branch = await Branch.findByIdAndDelete(req.params.id);

        if (!branch) {
            return next(new AppError('No branch found with that ID to delete.', 404));
        }
        res.status(204).json({
            success: true,
            data: null
        });
    });

    return {
        createBranch,
        getAllBranches,
        getBranch,
        updateBranch,
        deleteBranch
    };
};

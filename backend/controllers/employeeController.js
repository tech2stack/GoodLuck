// controllers/employeeController.js
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// --- Create a new employee (including branch admin) ---
exports.createEmployee = (models) => catchAsync(async (req, res, next) => {
    const Employee = models.Employee;
    const Branch = models.Branch;

    const { name, email, password, role, branch_id } = req.body;

    // 1) Ensure required fields are present
    if (!name || !email || !password || !role || !branch_id) {
        return next(new AppError('Please provide name, email, password, role, and branch ID.', 400));
    }

    // 2) Validate that the branch ID exists
    const existingBranch = await Branch.findById(branch_id);
    if (!existingBranch) {
        return next(new AppError('The provided branch ID does not exist.', 400));
    }

    // 3) Check if the email is already in use
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
        return next(new AppError('An employee with this email already exists.', 409)); // 409 Conflict
    }

    // 4) Create the new employee
    const newEmployee = await Employee.create({
        name,
        email,
        password,
        role, // 'employee' or 'branch_admin'
        branch_id
    });

    // Remove sensitive data from the response
    newEmployee.password = undefined;

    res.status(201).json({
        success: true,
        message: 'Employee created successfully!',
        data: newEmployee
    });
});

// --- Get all employees ---
exports.getAllEmployees = (models) => catchAsync(async (req, res, next) => {
    const Employee = models.Employee;

    const employees = await Employee.find().populate({
        path: 'branch_id',
        select: 'name location' // Only show branch name and location
    });

    res.status(200).json({
        success: true,
        count: employees.length,
        data: employees
    });
});

// --- Get a single employee (by ID) ---
exports.getEmployee = (models) => catchAsync(async (req, res, next) => {
    const Employee = models.Employee;

    const employee = await Employee.findById(req.params.id).populate({
        path: 'branch_id',
        select: 'name location'
    });

    if (!employee) {
        return next(new AppError('No employee found with this ID.', 404)); // 404 Not Found
    }

    res.status(200).json({
        success: true,
        data: employee
    });
});

// --- Update an employee ---
exports.updateEmployee = (models) => catchAsync(async (req, res, next) => {
    const Employee = models.Employee;

    // Only allow updates to name, email, role, and status (not password)
    const { name, email, role, status } = req.body;

    // Password update should be handled separately
    if (req.body.password) {
        return next(new AppError('Password cannot be updated via this route. Please use a dedicated route for password updates.', 400));
    }

    const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { name, email, role, status, updatedAt: Date.now() },
        {
            new: true, // Return updated document
            runValidators: true // Run schema validators
        }
    );

    if (!employee) {
        return next(new AppError('No employee found with this ID.', 404));
    }

    employee.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Employee updated successfully!',
        data: employee
    });
});

// --- Delete an employee ---
// Use this function with caution, as it permanently removes the employee record.
// If we later want to delete related branch data as well, logic should be added here.
exports.deleteEmployee = (models) => catchAsync(async (req, res, next) => {
    const Employee = models.Employee;

    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
        return next(new AppError('No employee found with this ID.', 404));
    }

    res.status(204).json({ // 204 No Content for successful deletion
        success: true,
        data: null
    });
});

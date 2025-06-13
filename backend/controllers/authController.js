// controllers/authController.js
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendToken = require('../utils/jwtToken'); // Ensure this file exists

// Ensure you have imported these models:
// const SuperAdmin = require('../models/SuperAdmin');
// const BranchAdmin = require('../models/BranchAdmin'); // If it's a separate model
// const Employee = require('../models/Employee');


// --- General Login (For both SuperAdmin and Employee) ---
// This function takes a 'models' object as a parameter and returns an Express middleware
exports.login = (models) => catchAsync(async (req, res, next) => {
    const SuperAdmin = models.SuperAdmin; // Access SuperAdmin model from models object
    const Employee = models.Employee;     // Access Employee model from models object
    const BranchAdmin = models.BranchAdmin; // Access BranchAdmin model from models object

    const { loginId, password, role } = req.body; // 'loginId' can be email or username

    // 1) Check if loginId, password, and role are provided
    if (!loginId || !password || !role) {
        console.log('Auth Controller: Login attempt failed: Missing loginId, password, or role'); // Debug log
        return next(new AppError('Please provide username/email, password, and role.', 400));
    }

    let user;
    let Model; // The model we will use (SuperAdmin, Employee, or BranchAdmin)

    // 2) Based on role, choose the correct model and find the user
    if (role === 'super_admin') {
        Model = SuperAdmin;
        user = await Model.findOne({ username: loginId }).select('+password');
    } else if (role === 'employee') {
        Model = Employee;
        user = await Model.findOne({ email: loginId }).select('+password');
    } else if (role === 'branch_admin') { // Separate login for BranchAdmin
        Model = BranchAdmin;
        user = await Model.findOne({ email: loginId }).select('+password');
    } else {
        console.log('Auth Controller: Login attempt failed: Invalid role provided:', role); // Debug log
        return next(new AppError('Invalid role provided.', 400));
    }

    // 3) Check if user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
        console.log('Auth Controller: Login attempt failed: Invalid credentials for user:', loginId); // Debug log
        return next(new AppError('Invalid credentials', 401)); // 401 Unauthorized
    }

    // 4) If everything is correct, send the token
    // Ensure the 'user' object in the response includes the 'role' field
    // Mongoose documents may omit virtual or unselected fields unless explicitly included
    const userResponseData = {
        _id: user._id,
        name: user.name,
        loginId: user.username || user.email,
        role: user.role, // <--- This key is important! Be sure to include it
    };

    console.log('Auth Controller: Login successful for:', userResponseData.loginId, 'Role:', userResponseData.role); // Debug log

    // Send JWT token (ensures the token is set in an HttpOnly cookie)
    // Use sendToken utility function, which takes user object and status code in response
    sendToken(user, 200, res);
    // sendToken usually ends the response after setting the cookie,
    // so no need to call res.status().json() again unless sendToken behaves differently
    // If sendToken only creates the token, you can send it like this:
    // res.status(200).json({
    //     success: true,
    //     user: userResponseData,
    //     token: user.getSignedJwtToken() // If this method exists on your user model
    // });
});


// --- Super Admin Registration (Only for initial setup) ---
exports.registerSuperAdmin = (models) => catchAsync(async (req, res, next) => {
    const SuperAdmin = models.SuperAdmin;

    const { name, username, password } = req.body;

    const existingSuperAdmin = await SuperAdmin.findOne({ username });
    if (existingSuperAdmin) {
        return next(new AppError('A Super Admin with this username already exists.', 409));
    }

    const newSuperAdmin = await SuperAdmin.create({
        name,
        username,
        password
    });

    console.log('Auth Controller: Super Admin registered:', newSuperAdmin.username);
    sendToken(newSuperAdmin, 201, res);
});

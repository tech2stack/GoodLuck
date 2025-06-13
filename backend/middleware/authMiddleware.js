// middleware/authMiddleware.js
const { promisify } = require('util');
const jwt = require('jsonwebtoken'); // Ensure jsonwebtoken is installed: npm install jsonwebtoken
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// This function generates a JWT token for a user
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// This function sends the JWT token in a cookie to the client
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Convert days to milliseconds
        ),
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production' // Only send over HTTPS in production
    };

    res.cookie('jwt', token, cookieOptions); // Set the cookie named 'jwt'

    // Remove password from output before sending response
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};


// Protect middleware: authenticates the user based on JWT
const protect = (models) => catchAsync(async (req, res, next) => {
    // 1) Get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) { // <-- FIX IS HERE: Added req.cookies check
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    let currentUser;
    // Find user based on role from the decoded token
    if (decoded.role === 'super_admin') {
        currentUser = await models.SuperAdmin.findById(decoded.id);
    } else if (decoded.role === 'branch_admin') {
        currentUser = await models.BranchAdmin.findById(decoded.id);
    } else if (decoded.role === 'employee') {
        currentUser = await models.Employee.findById(decoded.id);
    }
    // Add other roles here if needed

    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    // Add branchId to req.user if available for filtering
    if (currentUser.branchId) {
        req.user.branchId = currentUser.branchId;
    }
    next();
});

// Restrict to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array like ['admin', 'manager']
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403) // 403 Forbidden
            );
        }
        next();
    };
};

module.exports = {
    signToken,
    createSendToken,
    protect,
    restrictTo
};

// controllers/errorController.js

const AppError = require('../utils/appError'); // Import AppError class

// Helper functions to handle database errors
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown';
    const message = `Duplicate field value: "${value}". Please use a different value.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Handle JWT errors (authentication related)
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

// Send detailed error in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack // Show full stack trace in development
    });
};

// Send limited error in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Programming or unknown error: log and send generic message
        console.error('ERROR 💥', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};

// Global error handling middleware
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // Default status code 500
    err.status = err.status || 'error'; // Default status

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // Create a new object so we don't mutate the original err object
        let error = { ...err };
        error.message = err.message; // Copy message explicitly

        // Handle specific known error types
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

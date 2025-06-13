// utils/appError.js

class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent Error constructor

        this.statusCode = statusCode; // HTTP status code (e.g., 404, 400)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // ‘fail’ for 4xx, ‘error’ otherwise
        this.isOperational = true; // Marks this as a known operational error

        // Ensure the stack trace excludes this constructor
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

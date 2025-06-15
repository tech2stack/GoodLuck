const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const mainRouter = require('./routes/index'); // Import the main aggregated router

const app = express();

// Enable CORS for all requests
app.use(cors({
    origin: 'http://localhost:3000', // IMPORTANT: Replace with your frontend URL in production
    credentials: true // Allow cookies to be sent
}));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API (prevent brute force/DoS)
const limiter = rateLimit({
    max: 1000, // Max 1000 requests per hour from one IP
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); // Apply to all API routes

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // Parse JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse cookies from incoming requests

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Prevent parameter pollution (e.g., ?sort=duration&sort=price)
app.use(hpp({
    // whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'] // Add fields you want to allow duplicates for
}));

// Mounting the main router at /api/v1
app.use('/api/v1', mainRouter); // All your routes will now be under /api/v1/...

// Handle undefined routes (404 Not Found)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware (This must be the last middleware)
app.use(globalErrorHandler);

module.exports = app;
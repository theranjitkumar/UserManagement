require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('./config/db');
const winston = require('./config/logger');

// Import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');

const app = express();

// Test database connection
require('./config/db').testConnection();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Logging middleware
app.use((req, res, next) => {
    winston.info(`${req.method} ${req.originalUrl}`, {
        query: req.query,
        body: req.body,
        ip: req.ip
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        error: {
            statusCode: StatusCodes.NOT_FOUND,
            message: 'The requested resource was not found on this server.'
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    winston.error(`${err.status || StatusCodes.INTERNAL_SERVER_ERROR} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
        error: {
            status: statusCode,
            message: err.message || 'An unexpected error occurred',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    };

    // Remove stack trace in production
    if (process.env.NODE_ENV === 'production') {
        delete errorResponse.error.stack;
    }

    res.status(statusCode).json(errorResponse);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    winston.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
    // Close server & exit process
    // server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    winston.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
});

module.exports = app;

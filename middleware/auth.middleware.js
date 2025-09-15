const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

// Protect routes - user must be authenticated
const protect = async (req, res, next) => {
    try {
        // 1) Get token and check if it exists
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access.', StatusCodes.UNAUTHORIZED)
            );
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findByPk(decoded.id);
        if (!currentUser) {
            return next(
                new AppError('The user belonging to this token no longer exists.', StatusCodes.UNAUTHORIZED)
            );
        }

        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(
                new AppError('User recently changed password! Please log in again.', StatusCodes.UNAUTHORIZED)
            );
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    } catch (error) {
        return next(
            new AppError('Invalid token or session expired. Please log in again.', StatusCodes.UNAUTHORIZED)
        );
    }
};

// Restrict to certain roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', StatusCodes.FORBIDDEN)
            );
        }
        next();
    };
};

// Only for rendered pages, no errors!
const isLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            // 1) Verify token
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

            // 2) Check if user still exists
            const currentUser = await User.findByPk(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        }
        next();
    } catch (err) {
        return next();
    }
};

module.exports = {
    protect,
    restrictTo,
    isLoggedIn
};

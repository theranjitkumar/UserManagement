const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
        });

        res.status(StatusCodes.OK).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
        });

        if (!user) {
            return next(
                new AppError('No user found with that ID', StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        // 1) Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'fail',
                errors: errors.array(),
            });
        }

        const { firstName, lastName, email, password, role } = req.body;

        // 2) Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(
                new AppError('Email already in use', StatusCodes.CONFLICT)
            );
        }

        // 3) Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            role: role || 'user',
        });

        // Remove sensitive data from the response
        newUser.password = undefined;

        res.status(StatusCodes.CREATED).json({
            status: 'success',
            data: {
                user: newUser,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        // 1) Filter out unwanted fields that are not allowed to be updated
        const filteredBody = {};
        const allowedFields = ['firstName', 'lastName', 'email', 'role', 'isActive'];

        Object.keys(req.body).forEach((el) => {
            if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
        });

        // 2) Update user document
        const [updated] = await User.update(filteredBody, {
            where: { id: req.params.id },
            returning: true,
            plain: true,
        });

        if (!updated) {
            return next(
                new AppError('No user found with that ID', StatusCodes.NOT_FOUND)
            );
        }

        // 3) Get the updated user
        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
        });

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        // 1) Find the user
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return next(
                new AppError('No user found with that ID', StatusCodes.NOT_FOUND)
            );
        }

        // 2) Delete the user (soft delete if paranoid is enabled)
        await user.destroy();

        res.status(StatusCodes.NO_CONTENT).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deactivate user
// @route   PATCH /api/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return next(
                new AppError('No user found with that ID', StatusCodes.NOT_FOUND)
            );
        }

        user.isActive = false;
        await user.save();

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'User deactivated successfully',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reactivate user
// @route   PATCH /api/users/:id/reactivate
// @access  Private/Admin
exports.reactivateUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, { paranoid: false });

        if (!user) {
            return next(
                new AppError('No user found with that ID', StatusCodes.NOT_FOUND)
            );
        }

        // If user was soft-deleted, restore them
        if (user.deletedAt) {
            await user.restore();
        }

        // Reactivate the user
        user.isActive = true;
        await user.save();

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'User reactivated successfully',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const { validationResult, check } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');

// Validation middleware wrapper
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));

    next(
      new AppError('Validation failed', StatusCodes.UNPROCESSABLE_ENTITY, {
        errors: errorMessages,
      })
    );
  };
};

// Common validation rules
const commonUserRules = {
  firstName: check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  lastName: check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  email: check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  password: check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  role: check('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),
};

// Validation rules for different endpoints
const authValidation = {
  // Register validation
  register: validate([
    commonUserRules.firstName,
    commonUserRules.lastName,
    commonUserRules.email,
    commonUserRules.password,
    commonUserRules.role,
  ]),

  // Login validation
  login: validate([
    commonUserRules.email,
    check('password')
      .notEmpty()
      .withMessage('Password is required'),
  ]),

  // Forgot password validation
  forgotPassword: validate([
    commonUserRules.email,
  ]),

  // Reset password validation
  resetPassword: validate([
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    check('passwordConfirm')
      .notEmpty()
      .withMessage('Please confirm your password')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
  ]),

  // Update password validation
  updatePassword: validate([
    check('currentPassword')
      .notEmpty()
      .withMessage('Please provide your current password'),
    check('newPassword')
      .notEmpty()
      .withMessage('Please provide a new password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    check('passwordConfirm')
      .notEmpty()
      .withMessage('Please confirm your new password')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
  ]),
};

const userValidation = {
  // Create user validation (admin)
  createUser: validate([
    commonUserRules.firstName,
    commonUserRules.lastName,
    commonUserRules.email,
    commonUserRules.password,
    commonUserRules.role,
  ]),

  // Update user validation
  updateUser: validate([
    commonUserRules.firstName.optional(),
    commonUserRules.lastName.optional(),
    commonUserRules.email.optional(),
    commonUserRules.role.optional(),
    check('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ]),

  // ID parameter validation
  idParam: validate([
    check('id')
      .notEmpty()
      .withMessage('User ID is required')
      .isUUID()
      .withMessage('Invalid user ID format'),
  ]),
};

// Error handling middleware for validation errors
const handleValidationErrors = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
    const errors = {};

    if (err.errors) {
      err.errors.forEach((error) => {
        errors[error.path] = error.message;
      });
    }

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: 'Validation failed',
      errors,
    });
  }

  next(err);
};

module.exports = {
  validate,
  authValidation,
  userValidation,
  handleValidationErrors,
};

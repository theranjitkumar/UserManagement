const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authValidation } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authValidation.register, authController.register);
router.post('/login', authValidation.login, authController.login);
router.post('/forgot-password', authValidation.forgotPassword, authController.forgotPassword);
router.patch('/reset-password/:token', authValidation.resetPassword, authController.resetPassword);

// Protected routes (require authentication)
router.use(protect);

router.get('/me', authController.getMe);
router.patch('/update-me', authController.updateMe);
router.patch('/update-password', authValidation.updatePassword, authController.updatePassword);

module.exports = router;

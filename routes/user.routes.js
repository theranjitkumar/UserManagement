const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { userValidation } = require('../middleware/validation.middleware');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Protect all routes after this middleware
router.use(protect);

// Restrict all routes to admin only
router.use(restrictTo('admin'));

// User management routes
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userValidation.createUser, userController.createUser);

router
    .route('/:id')
    .get(userValidation.idParam, userController.getUser)
    .patch(userValidation.idParam, userValidation.updateUser, userController.updateUser)
    .delete(userValidation.idParam, userController.deleteUser);

// User activation/deactivation routes
router.patch(
    '/:id/deactivate',
    userValidation.idParam,
    userController.deactivateUser
);

router.patch(
    '/:id/reactivate',
    userValidation.idParam,
    userController.reactivateUser
);

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require("../utils/multer"); // make sure multer exports correctly

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateProfile, // make sure this exists in controllers/auth.js
    updatePassword,
    allUsers,
    deleteUser,
    getUserDetails,
    updateUser,
} = require('../controllers/auth');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// Public routes
router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

// Protected routes
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword);

// Admin routes
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), allUsers);

router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;

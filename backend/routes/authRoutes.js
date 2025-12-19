const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Admin Route
router.get('/user', 
    verifyToken, 
    authorizeRoles('ADMIN'), 
    // FIX: Changed .getAllUsers to .getDirectory to match userController.js
    require('../controllers/userController').getDirectory 
);

module.exports = router;
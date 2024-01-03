const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/adminAuthMiddleware');

// Route to view all users (accessible only by admin)
router.get('/users', authenticateToken, adminController.viewAllUsers);

// Route to view a specific user by ID (accessible only by admin)
router.get('/users/:id', authenticateToken, adminController.viewUserById);

// Route to modify user details by ID (accessible only by admin)
router.put('/users/:id', authenticateToken, adminController.modifyUserDetails);

// Route to delete a user by ID (accessible only by admin)
router.delete('/users/:id', authenticateToken, adminController.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Route to get user details by ID (protected by authentication middleware)
router.get('/:id', authenticateToken, userController.getUserDetails);

// Route to update user details (protected by authentication middleware)
router.put('/:id', authenticateToken, userController.updateUserDetails);

// Route to delete a user by ID (protected by authentication middleware)
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;

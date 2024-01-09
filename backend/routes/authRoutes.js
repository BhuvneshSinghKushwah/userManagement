const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user signup
router.post('/signup', authController.signup);

// Route for user login
router.post('/login', authController.login);

// Route for authenticating user JWT
router.get('/authJWT', authController.authJWT);

// router.get('/authAdmin', authController.authAdmin);

module.exports = router;

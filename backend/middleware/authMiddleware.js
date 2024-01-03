const jwt = require('jsonwebtoken');
const config = require('../config/config');
const UserModel = require('../models/userModel');

// Middleware function to validate JWT token
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Token is missing or invalid' });
  }

  const tokenData = token.split(' ')[1]; // Extract token from 'Bearer <token>'
  try {
    const decoded = jwt.verify(tokenData, config.JWT_SECRET);

    // Check if the user (email or phone) exists in the database
    const user = await UserModel.findOne({
      $or: [{ email: decoded.identifier }, { phone: decoded.identifier }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user; // Attach user details to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = { authenticateToken };

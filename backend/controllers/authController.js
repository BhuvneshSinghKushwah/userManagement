const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const config = require('../config/config');

// Function to handle user signup
exports.signup = async (req, res) => {
  const { email, phone, name, password, userImage, role } = req.body;

  try {
    // Validate input fields (you can add more validations as needed)
    if ((!email && !phone) || !password || !name) {
      return res.status(400).json({ error: 'Please provide required information' });
    }

    // Check if the user with the provided email or phone already exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or Phone number already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance using the UserModel
    const newUser = new UserModel({
      email,
      phone,
      name,
      password: hashedPassword,
      userImage,
      role,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to handle user login
exports.login = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    // Validate input fields (you can add more validations as needed)
    if ((!email && !phone) || !password) {
      return res.status(400).json({ error: 'Please provide email/phone and password' });
    }

    // Find the user by email or phone
    const user = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token upon successful login
    const token = jwt.sign(
      {
        identifier: email || phone, // Using email or phone as the identifier
        role: user.role, // Include user's role in the token payload
      },
      config.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour (adjust as needed)
    );

    res.status(200).json({ token }); // Return the generated token
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

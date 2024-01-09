const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const config = require('../config/config');
const multer = require('multer');

// Set up multer storage
const storage = multer.memoryStorage(); // Store in memory (as Buffer)
const upload = multer({ storage: storage }).single('userImage');

exports.signup = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ error: 'Multer error' });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ error: 'Unknown error' });
    }

    const { email, phone, name, password, role } = req.body;
    const userImage = req.file ? req.file.buffer : null; // Get image buffer if it exists

    try {
      // Validate input fields (you can add more validations as needed)
      if ((!email && !phone) || !password || !name) {
        return res.status(400).json({ error: 'Please provide required information' });
      }

      // Check if the user with the provided email or phone already exists
      let existingUser;
      if (email) {
        existingUser = await UserModel.findOne({ email });
      } else if (phone) {
        existingUser = await UserModel.findOne({ phone });
      }

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
  });
};


// Function to handle user login
exports.login = async (req, res) => {
  const { emailPhone, password } = req.body;

  try {
    // Validate input fields (you can add more validations as needed)
    if (!password || !emailPhone) {
      return res.status(400).json({ error: 'Please provide email/phone and password' });
    }

    // Find the user by email or phone
    const user = await UserModel.findOne({
      $or: [{ email: emailPhone }, { phone: emailPhone }]
    });

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
        identifier: user.email || user.phone, // Use user's email or phone as the identifier
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

exports.authJWT = async (req, res) => {
  const token = req.headers.authorization;
  const tokenData = token.split(' ')[1];
  
  try {
    const decoded = jwt.verify(tokenData, config.JWT_SECRET);
    
    const user = await UserModel.findOne({
      $or: [{ email: decoded.identifier }, { phone: decoded.identifier }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    res.status(200).json({ user }); // Return all user data
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// exports.authAdmin = async (req, res) => {
//   const token = req.headers.authorization;
//   console.log('headers: ', req.headers);
//   const tokenData = token.split(' ')[1];
//   console.log('Received token:', tokenData); 
//   try {
//     const decoded = jwt.verify(tokenData, config.JWT_SECRET);
//     const user = await UserModel.findOne({
//       $or: [{ email: decoded.identifier }, { phone: decoded.identifier }],
//     });

//     if (!user) {
//       return res.status(401).json({ error: 'Unauthorized: User not found' });
//     }

//     if(user.role !== 'admin')
//     {
//       return res.status(401).json({ message: "user is not admin" });
//     }
//     res.status(200).json({ message: "user is admin" });
//   } catch (err) {
//     console.error('Token verification error:', err);
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: 'Unauthorized: Token expired' });
//     }
//     return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//   }
// };



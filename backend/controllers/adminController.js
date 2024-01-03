const UserModel = require('../models/userModel');

// Function to view all users (accessible only by admin)
exports.viewAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await UserModel.find();

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to view a specific user by ID (accessible only by admin)
exports.viewUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params

    // Fetch the user details from the database based on the ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user details
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to modify user details by ID (accessible only by admin)
exports.modifyUserDetails = async (req, res) => {
  const { name, userImage } = req.body;

  try {
    const userId = req.params.id; // Get user ID from request params

    // Fetch user details from the database based on the ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details (name and userImage)
    user.name = name || user.name; // Update name if provided, else keep the existing name
    user.userImage = userImage || user.userImage; // Update userImage if provided, else keep the existing userImage

    // Save the updated user details to the database
    await user.save();

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a user by ID (accessible only by admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params

    // Find user by ID and delete from the database
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

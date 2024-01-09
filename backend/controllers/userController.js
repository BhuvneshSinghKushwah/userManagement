const UserModel = require('../models/userModel');

// Function to get user details by ID
exports.getUserDetails = async (req, res) => {
  try {
    const userIdentifier = req.params.id; // Assuming you're passing email or phone as a parameter in the URL

    // Check if the userIdentifier matches either email or phone in the database
    const user = await UserModel.findOne({
      $or: [
        { email: userIdentifier },
        { phone: userIdentifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Do something with the found user
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update user details
exports.updateUserDetails = async (req, res) => {
  const { email, phone, name, userImage } = req.body;

  try {
    const userIdentifier = req.params.id; // Get user ID from request params

    // Fetch user details from the database based on the ID
    const user = await UserModel.findOne({
      $or: [
        { email: userIdentifier },
        { phone: userIdentifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details (name and userImage)
    user.email = email || user.email;
    user.phone = phone || user.phone;
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

// Function to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params

    // Find user by email or phone and delete from the database
    const deletedUserByEmail = await UserModel.findOneAndDelete({ email: userId });
    const deletedUserByPhone = await UserModel.findOneAndDelete({ phone: userId });

    if (!deletedUserByEmail && !deletedUserByPhone) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


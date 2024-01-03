const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null or empty strings as unique fields
        required: function() {
            return !this.phone; // Email is required if phone is not provided
        }
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allows null or empty strings as unique fields
        required: function() {
            return !this.email; // Phone is required if email is not provided
        }
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userPicture: {
        type: String // You can use a String to store image URLs or Buffer for image data
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;

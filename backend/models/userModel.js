const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true,
        validate: [
            {
                validator: function(value) {
                    return !this.phone && !this.email ? this.isNew && !(!value || value.trim().length === 0) : true;
                },
                message: 'Email or Phone number is required'
            },
            {
                validator: function(value) {
                    return !value || /^\S+@\S+\.\S+$/.test(value); // Basic email format validation
                },
                message: 'Invalid email format'
            }
        ]
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        validate: [
            {
                validator: function(value) {
                    return !this.email && !this.phone ? this.isNew && !(!value || value.trim().length === 0) : true;
                },
                message: 'Email or Phone number is required'
            },
            {
                validator: function(value) {
                    return !value || /^\d{10}$/.test(value); // Basic phone number format validation
                },
                message: 'Invalid phone number format'
            }
        ]
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userImage: {
        type: Buffer
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
    
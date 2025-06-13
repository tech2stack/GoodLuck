// models/SuperAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT token generation

const superAdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter your username/email'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password by default in queries
    },
    name: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: 'super_admin',
        enum: ['super_admin'] // Role is always super_admin
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving
superAdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
superAdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a signed JWT token
superAdminSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;

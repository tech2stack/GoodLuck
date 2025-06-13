// models/Employee.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password in queries
    },
    role: {
        type: String,
        default: 'employee',
        enum: ['employee']
    },
    branch_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Branch',
        required: [true, 'Please select the branch to which this employee belongs']
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

// Hash password before saving
employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
employeeSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
employeeSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

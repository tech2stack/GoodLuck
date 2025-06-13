// models/Branch.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'कृपया शाखा का नाम दर्ज करें'],
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: [true, 'कृपया शाखा का स्थान दर्ज करें'],
        trim: true
    },
    // Add the createdBy field to the schema
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'SuperAdmin', // This should reference your SuperAdmin model name
        required: [true, 'शाखा बनाने वाले एडमिन की जानकारी आवश्यक है']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This will automatically manage createdAt and updatedAt
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;

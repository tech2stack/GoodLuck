// models/BranchAdmin.js
const mongoose = require('mongoose');

const branchAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'शाखा एडमिन का नाम आवश्यक है']
    },
    email: {
        type: String,
        required: [true, 'शाखा एडमिन का ईमेल आवश्यक है'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'पासवर्ड आवश्यक है'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['branch_admin'],
        default: 'branch_admin'
    },
    // --- नया फ़ील्ड ---
    branchId: {
        type: mongoose.Schema.ObjectId, // Branch मॉडल की _id का रेफरेंस
        ref: 'Branch', // 'Branch' मॉडल को रेफर करता है
        required: [true, 'शाखा एडमिन को एक शाखा से संबंधित होना चाहिए']
    },
    // ------------------
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// पासवर्ड हैशिंग जैसे प्री-सेव हुक्स यहाँ जोड़ें
branchAdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12); // bcrypt इम्पोर्ट करना होगा
    next();
});

const BranchAdmin = mongoose.model('BranchAdmin', branchAdminSchema);
module.exports = BranchAdmin;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    otp: {
        type: String,
        default: null,
    },

    otpExpiry: {
        type: Date,
        default: null,
    },

    avatar: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
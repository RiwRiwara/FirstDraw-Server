const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    displayname: {
        type: String,
        required: false,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        enum: ['Silver', 'Blue', 'Dragon'],
        default: 'Silver'
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    }
}, { timestamps: true })


module.exports = mongoose.model("User", userSchema)

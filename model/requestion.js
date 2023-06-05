const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    userid:{
        type: String,
        required: true
    },
    cardReq:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected'],  
        default: 'pending'
    },
    note:{
        type: String,
        required: false
    },
    type:{
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);

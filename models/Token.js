const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required:[true,"Must include user associated with token"]
    },
    refreshToken: {
        type: String,
        required: [true,"Must include refreshToken"]
    },
    isValid: {
        type: Boolean,
        default: true,
        required: [true, "Must include validity"]
    },
    ip: {
        type: String,
    },
    userAgent: {
        type: String,
    },
},{
    timestamps:true
})

module.exports = mongoose.model("Token",tokenSchema)
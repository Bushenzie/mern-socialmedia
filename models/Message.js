const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Chat",
        required: [true,"Must provide chat"]
    },
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true,"Must provide sender"]
    },
    value: {
        type: String,
        required: [true,"Must provide message"],
    },
    edited: {
        type: Boolean,
        default: false,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Message",messageSchema);
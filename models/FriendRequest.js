const mongoose = require("mongoose");
const User = require("./User");
const { Error } = require("../utils");

const friendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true,"Must provide friend request sender"]
    },
    to: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true,"Must provide friend request receiver"]
    },
    status: {
        type: String,
        enum: ["pending","accepted","declined"],
        default: "pending"
    }
},
{
    timestamps:true
})

module.exports = mongoose.model("FriendRequest",friendRequestSchema);
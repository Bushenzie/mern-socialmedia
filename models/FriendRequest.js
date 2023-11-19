const mongoose = require("mongoose");


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
    }
    // accepted: {
    //     type: Boolean,
    //     default: false
    // },
    // status: {
    //     type: String,
    //     enum: ["pending","accepted","declined"],
    //     default: "pending",
    // }
},
{
    timestamps:true
})

module.exports = mongoose.model("FriendRequest",friendRequestSchema);
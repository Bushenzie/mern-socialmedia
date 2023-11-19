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

// friendRequestSchema.methods.acceptRequest = async function() {
//     if(this.status !== "pending") throw new Error(400,"Request is not active")
//     let sender = await User.findById({_id: this.from});
//     let receiver = await User.findById({_id: this.to});
//     if(!sender || !receiver) throw new Error(404,"Invalid sender or receiver");
//     if(sender.friends.includes(receiver) || receiver.friends.includes(sender)) throw new Error(400,"Users already friends");
//     await User.findOneAndUpdate({_id:sender._id},{ friends: [...friends,receiver._id]})
//     await User.findOneAndUpdate({_id:receiver._id},{ friends: [...friends,sender._id]})
//     this.status = "accepted";
//     await this.validate();
//     await this.save();
// }

// friendRequestSchema.methods.declineRequest = async function() {
//     if(this.status !== "pending") throw new Error(400,"Request is not active")
//     this.status = "declined";
//     await this.validate();
//     await this.save();
// }

module.exports = mongoose.model("FriendRequest",friendRequestSchema);
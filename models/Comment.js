const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post",
        required: [true,"Must include postID"]
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true,"Must include UserID"]
    },
    value: {
        type: String,
        required: [true,"Must provide comment"],
        maxlength: 300
    },
    likes: {
        type: Number,
        default: 0
    }
},
{
    timestamps:true
})

module.exports = mongoose.model("Comment",commentSchema);
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true,"Must include UserID"]
    }
})

const commentSchema = new mongoose.Schema({
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
})

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true,"Must include UserID"]
    },
    description: {
        type: String,
        maxlength: 500,
        required: [true,"Must include Description"]
    },
    picturePath: {
        type: String,
        default: ""
    },
    likes: {
        type: [likeSchema],
        required: [true,"Must provide likes"]
    },
    comments: {
        type: [commentSchema],
        required: [true,"Must provide likes"]
    },
}, {
    timestamps:true
})

module.exports = mongoose.model("Post",postSchema)
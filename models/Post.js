const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true,"Must include UserID"]
    },
    description: {
        type: String,
        maxlength: 500,
        default:""
        //required: [true,"Must include Description"],
    },
    picturePath: {
        type: String,
        default: ""
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
        default: []
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps:true
})

postSchema.virtual("comments",{
    ref: "Comment",
    localField: "_id",
    foreignField: "post",
    justOne: false
})


module.exports = mongoose.model("Post",postSchema)
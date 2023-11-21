const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
        required: [true,"Must provide 2 or more members to create chat"]
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Chat",chatSchema);
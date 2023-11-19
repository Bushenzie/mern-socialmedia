const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");
//Other Models - cant user desctructuring due to some "module exports inside circular dependency" warning
const FriendRequest = require("./FriendRequest");
const Post = require("./Post");
const Comment = require("./Comment");
const Token = require("./Token");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"Must provide first name"],
        minlength: [3,"Minimum length of first name are 3 characters"],
        maxlength: [50,"Maximum length of first name is 50 characters"]
    },
    lastName: {
        type: String,
        required: [true,"Must provide last name"],
        minlength: [3,"Minimum length of last name are 3 characters"],
        maxlength: [50,"Maximum length of last name is 50 characters"]
    },
    email: {
        type: String,
        unique: [true,"User with this email already exist"],
        required: [true,"Must provide email"],
        validate: {
            validator: (val) => validator.isEmail(val),
            message: "Not a valid email"
        }
    },
    friends: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
        default: [],
        required: [true,"Must provide friends"]
    },
    password: {
        type: String,
        minlength: 6,
        required: [true,"Must provide password"]
    },
    picturePath: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["user","admin"],
        default: "user",
        required: true
    },
    verificationToken: {
        type: String,
        default: ""
    },
    verificationDate: {
        type: Date,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        default: "",
    },
    job: {
        type: String,
        default: "",
    },
    viewedCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps:true
})

userSchema.pre("save",async function() { 
    if(!this.isModified("password")) return;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(this.password,salt);
    this.password = hashedPassword;
})

//Fully test this!
userSchema.pre("remove",async function() {
    await FriendRequest.deleteMany({ $or: [{to: this._id}, {from: this._id}]})
    await Comment.deleteMany({ user: this._id })
    await Token.deleteMany({ user: this._id })
    await Post.deleteMany({ user: this._id })
})

userSchema.methods.checkPassword = async function(passwordToCheck) {
    const isValid = await bcryptjs.compare(passwordToCheck,this.password);
    return isValid;
}

userSchema.methods.addFriend = async function(friendId) {
    this.friends.push(friendId);
    await this.validate();
    await this.save();
}

userSchema.methods.removeFriend = async function(friendId) {
    let filteredFriends = this.friends.filter(friend => friend.toString() !== friendId);
    this.friends = filteredFriends;
    await this.validate();
    await this.save();
}

module.exports = mongoose.model("User",userSchema)
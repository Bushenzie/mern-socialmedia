const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"Must provide first name"],
        maxlength: [50,"Maximum length of first name is 50 characters"]
    },
    lastName: {
        type: String,
        required: [true,"Must provide last name"],
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
        minlength: 6,
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

userSchema.methods.checkPassword = async function(passwordToCheck) {
    const isValid = await bcryptjs.compare(passwordToCheck,this.password);
    return isValid;
}

module.exports = mongoose.model("User",userSchema)
const { Error,createJWT,removeCookie,sendVerificationEmail,createTokenUser, setCookies } = require("../utils");
const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

//TODOs
//Refactor + Reset & Forgot password

async function register(req,res) {
    const { firstName,lastName,email,password,picturePath="",location="",job="" } = req.body;
    if(!firstName || !lastName || !email || !password) throw new Error(StatusCodes.BAD_REQUEST,"Missing credentials");

    const allUsers = await User.find({});
    const role = allUsers.length === 0 ? "admin" : "user"

    const verificationToken = await crypto.randomBytes(32).toString("hex");
    
    const createdUser = await User.create({firstName, lastName, email, password, picturePath, location, job, role, verificationToken});
    const tokenUser = createTokenUser(createdUser);

    await sendVerificationEmail(createdUser.email,verificationToken);

    res.status(StatusCodes.OK).json({
        msg: "Sent verification email!",
        user: tokenUser,
        verificationToken
    });
}

async function login(req,res) {
    const {email,password} = req.body;
    if(!email || !password) throw new Error(StatusCodes.BAD_REQUEST, "Missing credentials");

    const user = await User.findOne({email});
    if(!user) throw new Error(StatusCodes.NOT_FOUND, "No user found")

    const isValidPassword = await user.checkPassword(password);
    if(!isValidPassword) throw new Error(StatusCodes.UNAUTHORIZED,"Invalid password");
    if(!user.isVerified) throw new Error(StatusCodes.UNAUTHORIZED,"Verify your email");

    const tokenUser = createTokenUser(user);

    let refreshToken = "";
    const existingRefreshToken = await Token.findOne({user: user.id});

    if(existingRefreshToken) {
        if(existingRefreshToken.isValid) {
            refreshToken = existingRefreshToken.refreshToken;
        }
    } else {
        refreshToken = await crypto.randomBytes(40).toString("hex");
        const userAgent = req.headers["user-agent"] || "-";
        const ip = req.headers["ip"] || "-";

        await Token.create({
            user: user._id,
            isValid: true,
            refreshToken,
            ip,
            userAgent
        })
    }
    
    setCookies(res,
        { name: "accessToken", value: createJWT({user: tokenUser}), expireTime: 1000*60*15 },
        { name: "refreshToken", value: createJWT({user: tokenUser, refreshToken}), expireTime: 1000*60*60*24*60}
    )

    req.user = tokenUser;

    res.status(StatusCodes.OK).json({
        msg: "OK",
        user: tokenUser
    });
}

async function logout(req,res) {
    const {userId} = req.user;
    if(!userId) throw new Error(StatusCodes.UNAUTHORIZED,"Invalid userId");

    const searchedToken = await Token.findOneAndDelete({user: userId});
    if(!searchedToken) throw new Error(StatusCodes.UNAUTHORIZED,"Token was not found");
    
    removeCookie(res,"refreshToken");
    removeCookie(res,"accessToken");

    res.status(StatusCodes.OK).json({
        msg: "User logged out"
    });
}

async function verifyEmail(req,res) {
    const {email,verificationToken} = req.query;
    if(!email || !verificationToken) throw new Error(StatusCodes.BAD_REQUEST,"Missing credentials to verify user");

    const searchedUser = await User.findOne({email});
    if(!searchedUser) throw new Error(StatusCodes.NOT_FOUND,"User to verify was not found");

    if(verificationToken !== searchedUser.verificationToken) throw new Error(StatusCodes.UNAUTHORIZED,"Invalid token");
    
    searchedUser.isVerified = true;
    searchedUser.verificationToken = "";
    searchedUser.verificationDate = new Date(Date.now());
    await searchedUser.save();

    res.status(StatusCodes.OK).json({
        msg: `User with email ${email} was successfully verified`,
    });
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail
}
const { Error,createJWT,setCookie,removeCookie,sendVerificationEmail,createTokenUser } = require("../utils");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

async function register(req,res) {
    const { firstName,lastName,email,password,picturePath="",location="",job="" } = req.body;
    if(!firstName || !lastName || !email || !password) throw new Error(StatusCodes.BAD_REQUEST,"Missing credentials");

    const isFirstUser = await User.find({}).length === 0;
    const role = isFirstUser ? "admin" : "user"

    const verificationToken = await crypto.randomBytes(16).toString("hex");
    
    const createdUser = await User.create({firstName, lastName, email, password, picturePath, location, job, role, verificationToken});
    const tokenUser = createTokenUser(createdUser);

    await sendVerificationEmail(createdUser.email,verificationToken);

    res.status(StatusCodes.OK).json({
        msg: "Sent verification email!",
        user: tokenUser,
    });
}

async function login(req,res) {
    const {email,password} = req.body;
    if(!email || !password) throw new Error(StatusCodes.BAD_REQUEST, "Missing credentials");

    const user = await User.findOne({email});
    if(!user) throw new Error(StatusCodes.NOT_FOUND, "No user found")

    const isValidPassword = await user.checkPassword(password);
    if(!isValidPassword) throw new Error(StatusCodes.UNAUTHORIZED,"Invalid password");
    if(!user.verified) throw new Error(StatusCodes.UNAUTHORIZED,"Verify your email");

    const tokenUser = createTokenUser(user);
    setCookie(res,{
        name: "accessToken",
        value: createJWT(tokenUser),
        expireTime: 1000*60*5
    })

    res.status(StatusCodes.OK).json({
        msg: "OK",
        user: tokenUser
    });
}

async function logout(req,res) {
    removeCookie(res,"accessToken");
    res.status(StatusCodes.OK).json({
        msg: "Log out && removed accessToken cookie"
    });
}

async function verifyEmail(req,res) {
    const {email,verificationToken} = req.query;
    if(!email || !verificationToken) throw new Error(StatusCodes.BAD_REQUEST,"Missing credentials to verify user");

    const searchedUser = await User.findOne({email});
    if(!searchedUser) throw new Error(StatusCodes.NOT_FOUND,"User to verify was not found");

    if(verificationToken !== searchedUser.verificationToken) throw new Error(StatusCodes.UNAUTHORIZED,"Invalid token");
    
    searchedUser.verified = true;
    searchedUser.verificationToken = "";
    await searchedUser.save();

    const tokenUser = createTokenUser(searchedUser);

    setCookie(res,{
        name: "accessToken",
        value: createJWT(tokenUser),
        expireTime: 1000*60*5
    })
    res.status(StatusCodes.OK).json({msg: `User with email ${email} was successfully verified`,user: tokenUser});
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail
}
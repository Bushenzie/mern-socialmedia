const { StatusCodes } = require("http-status-codes");
const { User,Token,Post } = require("../models");
const { Error, checkPermissions, removeCookie } = require("../utils");

//TODO
// Update User controller better handling + make it so you have to verify again email...

async function getAllUsers(req,res) {
    const allUsers = await User.find({});
    if(!allUsers) throw new Error(StatusCodes.NOT_FOUND,"No users found");

    res.status(StatusCodes.OK).json({
        msg: "OK",
        users: allUsers,
        count: allUsers.length
    });
}

async function getCurrentUser(req,res) {

    res.status(StatusCodes.OK).json({
        user: req.user
    })
}

async function getSingleUser(req,res) {
    const {id:userId} = req.params;
    
    const searchedUser = await User.findById({_id:userId});
    if(!searchedUser) throw new Error(StatusCodes.NOT_FOUND,"Seached user was not found");

    res.status(StatusCodes.OK).json({
        msg: "OK",
        user: searchedUser
    })
}

async function updateUser(req,res) {
    const {firstName, lastName, email, password, picturePath, location, job} = req.body;
    const {id:userId} = req.params;
    
    const currentUser = req.user;
    const searchedUser = await User.findById({_id:userId})
    if(!searchedUser) throw new Error(StatusCodes.NOT_FOUND,"No user with this id was found");
    checkPermissions(currentUser,searchedUser);

    searchedUser.firstName = firstName || searchedUser.firstName;
    searchedUser.lastName = lastName || searchedUser.lastName;
    searchedUser.email = email || searchedUser.email;
    searchedUser.password = password || searchedUser.password;
    searchedUser.picturePath = picturePath || searchedUser.picturePath;
    searchedUser.location = location || searchedUser.location;
    searchedUser.job = job || searchedUser.job;

    await searchedUser.validate();
    await searchedUser.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        user: searchedUser
    });
}

async function deleteUser(req,res) {
    const {id:userId} = req.params;

    const currentUser = req.user;
    const searchedUser = await User.findById({_id:userId})
    if(!searchedUser) throw new Error(StatusCodes.NOT_FOUND,"No user with this id was found");
    checkPermissions(currentUser,searchedUser);


    //Delete everything associated with User
    const tokens = await Token.deleteMany({user:userId});
    const posts = await Post.deleteMany({user:userId});
    const deletedUser = await User.findByIdAndDelete({_id:userId});
    if(!deletedUser) throw new Error(StatusCodes.NOT_FOUND,"Seached user was not found");

    removeCookie(res,"accessToken");
    removeCookie(res,"refreshToken");

    res.status(StatusCodes.OK).json({
        msg: "OK",
        tokensCount: tokens.deletedCount,
        postsCount: posts.deletedCount,
        user: deletedUser
    })
}


module.exports = {
    getAllUsers,
    getCurrentUser,
    getSingleUser,
    updateUser,
    deleteUser
}
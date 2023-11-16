const { StatusCodes } = require("http-status-codes");
const Error = require("./Error");

function createTokenUser(user) {
    return {
        userId: user._id,
        role: user.role,
        email: user.email
    }
}

function checkPermissions(currentUser,requestedUser) {
    if(currentUser.role === "admin") return;
    if(currentUser.userId === (requestedUser._id).toString()) return;
    throw new Error(StatusCodes.UNAUTHORIZED,"You cannot access this route")
}

module.exports = {
    createTokenUser,
    checkPermissions
}
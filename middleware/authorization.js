const { StatusCodes } = require("http-status-codes");
const { Error } = require("../utils");


function authorizeRoles(...roles) {
    return (req,res,next) => {
        if(roles.includes(req.user.role)) return next();
        throw new Error(StatusCodes.UNAUTHORIZED,"You are not allowed to view this page")
    }
}

module.exports = authorizeRoles
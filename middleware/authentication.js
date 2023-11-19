const { StatusCodes } = require("http-status-codes")
const { Error,getCookie, createJWT,verifyJWT, setCookies } = require("../utils")
const { Token } = require("../models")

async function authentication(req,res,next) {
    const accessToken = getCookie(req,"accessToken");
    const refreshToken = getCookie(req,"refreshToken");

    if (!accessToken && !refreshToken) throw new Error(StatusCodes.UNAUTHORIZED, "No login tokens");

    try {
        if(accessToken) {
            const payload = verifyJWT(accessToken);
            if(!payload) throw new Error(StatusCodes.UNAUTHORIZED,"Invalid accessToken");
            req.user = payload.user;
            return next();
        } else {
            const payload = verifyJWT(refreshToken);
            if(!payload) throw new Error(StatusCodes.UNAUTHORIZED,"Could not verify refreshToken");
    
            const searchedToken = await Token.findOne({ refreshToken: payload.refreshToken,user: payload.user.userId });
            if(!searchedToken || !searchedToken.isValid) throw new Error(StatusCodes.UNAUTHORIZED,"Invalid refreshToken validity");
    
            req.user = payload.user;
    
            setCookies(res,
                { name: "accessToken", value: createJWT({user: payload.user}), expireTime: 1000*60*15 },
                { name: "refreshToken", value: createJWT({user: payload.user, refreshToken: searchedToken.refreshToken}), expireTime: 1000*60*60*24*60}
            )
            return next()
        }
    } catch(err) {
        console.log(err);
        throw new Error(StatusCodes.INTERNAL_SERVER_ERROR,"Something went wrong during authentication")
    }

}

module.exports = authentication
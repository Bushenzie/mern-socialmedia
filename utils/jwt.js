const jwt = require("jsonwebtoken");

function createJWT(payload) {
    const createdToken = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
    return createdToken;
}

function verifyJWT(token) {
    const isValid = jwt.verify(token,process.env.JWT_SECRET);
    if(!isValid) return null;
    return isValid;
}

module.exports = {
    createJWT,
    verifyJWT
}
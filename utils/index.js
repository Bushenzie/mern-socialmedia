const Error = require("./Error");
const { createJWT, verifyJWT } = require("./jwt");
const { getCookie, setCookie,setCookies, removeCookie } = require("./cookies");
const { sendEmail,sendVerificationEmail } = require("./emails");
const { createTokenUser } = require("./misc");

module.exports = {
    Error,
    createJWT,
    verifyJWT,
    getCookie,
    setCookie,
    setCookies,
    removeCookie,
    sendEmail,
    sendVerificationEmail,
    createTokenUser
}
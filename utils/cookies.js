
function getCookie(req,cookieName) {
    return req.signedCookies[cookieName]
}

function setCookie(res,{name,value,expireTime}) {
    res.cookie(name,value,{
        secure: process.env.ENV === "prod",
        httpOnly:true,
        signed: true,
        expires: new Date(Date.now() + expireTime)
    })
}

function setCookies(res,...cookies) {
    cookies.forEach((cookie) => {
        setCookie(res,cookie);
    })
}

function removeCookie(res,cookieName) {
    res.cookie(cookieName,null,{
        secure: process.env.ENV === "prod",
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now())
    })
}

module.exports = {
    getCookie,
    setCookie,
    setCookies,
    removeCookie
}
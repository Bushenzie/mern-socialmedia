
function createTokenUser(user) {
    return {
        userId: user._id,
        role: user.role,
        email: user.email
    }
}

module.exports = {
    createTokenUser
}
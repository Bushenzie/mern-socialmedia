
class Error {
    constructor(statusCode,message) {
        this.message = message || "Something went wrong";
        this.statusCode = statusCode || 500;
    }
}

module.exports = Error;
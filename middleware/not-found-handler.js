const { StatusCodes } = require("http-status-codes")

function notFound(req,res) {
    res.status(StatusCodes.NOT_FOUND).send("404");
}

module.exports = notFound
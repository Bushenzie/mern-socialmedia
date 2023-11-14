const { StatusCodes } = require("http-status-codes");

//TODO Refactor

async function errorHandler(err,req,res,next) {
    //If there is error => handle it ,else go to the next Middleware
    if(err) {
        //Check if its CustomError
        const {message,statusCode} = err;
        //If not ,check for mongo errors or just send vanilla error
        if(!message || !statusCode) {
            //MongoDB Errors
            if(err.code === 11000) {
                return res.status(StatusCodes.BAD_REQUEST).json( {
                    message: `Email was already registered`,
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }
            if(err.name === "CastError") {
                return res.status(StatusCodes.BAD_REQUEST).json( {
                    message: `Invalid types for ${err.path}`,
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }
            if(err.name === "ValidationError") {
                return res.status(StatusCodes.BAD_REQUEST).json( {
                    message: err.message,
                    statusCode: StatusCodes.BAD_REQUEST
                })
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message , statusCode: StatusCodes.INTERNAL_SERVER_ERROR})
        }
        return res.status(statusCode).json({ message, statusCode})
    }
    next();
}

module.exports = errorHandler
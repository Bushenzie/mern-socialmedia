const { StatusCodes } = require("http-status-codes")
const { Error } = require("../utils")
const path = require("path");

async function uploadImage(req,res) {
    let maxImageSize = (1024*1024)*30 //30MB


    if(!req.files.image) throw new Error(StatusCodes.BAD_REQUEST,"No image uploaded")
    const {image} = req.files;

    if(!image.mimetype.startsWith("image")) throw new Error(StatusCodes.BAD_REQUEST,"Not an image");
    if(image.size > maxImageSize) throw new Error(StatusCodes.BAD_REQUEST,"Image is too big")

    const uploadsFolder = path.join(__dirname,"..","/public/uploads",image.name);
    image.mv(uploadsFolder);

    res.status(StatusCodes.OK).json({msg:"Successfully uploaded",path: uploadsFolder});
}

module.exports = {uploadImage}
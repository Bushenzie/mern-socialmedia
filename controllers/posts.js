const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post")


async function getAllPosts(req,res) {
    console.log(req.user)
    const allPosts = await Post.find({});
    if(allPosts.length === 0) return res.status(StatusCodes.NOT_FOUND).json({ msg: "No posts found" })
    res.status(StatusCodes.OK).json({msg: "OK", posts: allPosts, count: allPosts.length})
}

module.exports = {
    getAllPosts
}
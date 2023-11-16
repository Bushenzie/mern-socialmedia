const { StatusCodes } = require("http-status-codes");
const { Error, checkPermissions } = require("../utils");
const Post = require("../models/Post")


async function getAllPosts(req,res) {
    //const { friendsOnly } = req.query;
    
    const posts = await Post.find({});
    if(!posts) throw new Error(StatusCodes.NOT_FOUND,"No posts found");
    res.status(StatusCodes.OK).json({
        msg: "OK",
        count: posts.length,
        posts
    })
}

async function getSinglePost(req,res) {
    const { id:postId } = req.params;

    const searchedPost = await Post.findById({_id:postId}).populate({path: "comments"});
    if(!searchedPost) throw new Error(StatusCodes.NOT_FOUND,"No post with this id was found");
    res.status(StatusCodes.OK).json({
        msg: "OK",
        post: searchedPost
    })
}

async function createPost(req,res) {

    const {userId} = req.user;
    const {description,picturePath} = req.body;
    //if(!description) throw new Error(StatusCodes.BAD_REQUEST,"Missing required credentials")

    const post = await Post.create({
        user: userId,
        picturePath,
        description
    })

    res.status(StatusCodes.OK).json({
        msg: "OK",
        post
    })
}

async function updatePost(req,res) {
    const {description} = req.body;
    const {id:postId} = req.params;

    const searchedPost = await Post.findById(postId);
    if(!searchedPost) throw new Error(StatusCodes.NOT_FOUND,"Post with that id was not found")

    const currentUser = req.user;
    const searchedUser = searchedPost.user;
    checkPermissions(currentUser,searchedUser)

    searchedPost.description = description || searchedPost.description;
    await searchedPost.validate();
    await searchedPost.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        post: searchedPost
    })
}

async function deletePost(req,res) {
    const {id:postId} = req.params;
    const searchedPost = await Post.findById(postId);
    if(!searchedPost) throw new Error(StatusCodes.NOT_FOUND,"Post with that id was not found")

    const currentUser = req.user;
    const searchedUser = searchedPost.user;
    checkPermissions(currentUser,searchedUser)

    await Post.findOneAndDelete({_id:postId});

    res.status(StatusCodes.OK).json({
        msg: "OK",
        post: searchedPost
    })
}

module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    updatePost,
    deletePost
}
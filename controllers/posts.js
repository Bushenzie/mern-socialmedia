const { StatusCodes } = require("http-status-codes");
const { Error, checkPermissions } = require("../utils");
const Post = require("../models/Post")

//TODOs
//Queries and pagination 
//Tests + better updating
//Like & Comment functionality /w visible users that liked the comment or like...

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

async function addOrRemoveLikeToPost(req,res) {
    const {id:postId} = req.params;
    const {userId} = req.user;

    const searchedPost = await Post.findById(postId).populate("likes");
    if(!searchedPost) throw new Error(StatusCodes.NOT_FOUND,"Post with that id was not found")

    const currentLikes = searchedPost.likes;
    let updatedLikes = [];

    const alreadyLiked = currentLikes.find(user => user._id.toString() === userId);
    if(alreadyLiked) {
        updatedLikes = currentLikes.filter(like => like._id.toString() !== userId)
    } else {
        updatedLikes = [...currentLikes,userId]
    }

    searchedPost.likes = updatedLikes;
    await searchedPost.validate();
    await searchedPost.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        likes: searchedPost.likes,
        count: searchedPost.likes.length
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
    addOrRemoveLikeToPost,
    updatePost,
    deletePost
}
const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/Comment");
const { Error, checkPermissions } = require("../utils");

//TODOs
//Queries and pagination
//Tests + better updating

async function getAllComments(req,res) {

    const searchedComments = await Comment.find({});
    if(!searchedComments) throw new Error(StatusCodes.NOT_FOUND,"No comments found")

    res.status(StatusCodes.OK).json({
        msg: "OK",
        comments: searchedComments,
        count: searchedComments.count
    });
}

async function getSingleComment(req,res) {
    const {id:commentId} = req.params;

    const searchedComment = await Comment.findById({_id:commentId});
    if(!searchedComment) throw new Error(StatusCodes.NOT_FOUND,"Comment with this id was not found")

    res.status(StatusCodes.OK).json({
        msg: "OK",
        comment: searchedComment
    });
}

async function createComment(req,res) {
    const {post,value} = req.body;
    const {userId} = req.user;

    if(!post || !value || !userId) throw new Error(StatusCodes.BAD_REQUEST,"Missing required fields")

    const createdComment = await Comment.create({
        user: userId,
        post,
        value
    })

    res.status(StatusCodes.OK).json({
        msg: "OK",
        comment: createdComment
    })
}

async function addOrRemoveLikeToComment(req,res) {
    const {id:commentId} = req.params;
    const {userId} = req.user;

    const searchedComment = await Comment.findById(commentId).populate("likes");
    if(!searchedComment) throw new Error(StatusCodes.NOT_FOUND,"Comment with that id was not found")

    const currentLikes = searchedComment.likes;
    let updatedLikes = [];

    const alreadyLiked = currentLikes.find(user => user._id.toString() === userId);
    if(alreadyLiked) {
        updatedLikes = currentLikes.filter(like => like._id.toString() !== userId)
    } else {
        updatedLikes = [...currentLikes,userId]
    }

    searchedComment.likes = updatedLikes;
    await searchedComment.validate();
    await searchedComment.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        likes: searchedComment.likes,
        count: searchedComment.likes.length
    })
}

async function updateComment(req,res) {
    const { id:commentId } = req.params
    const { value:changedValue } = req.body

    const searchedComment = await Comment.findById({_id:commentId});
    if(!searchedComment) throw new Error(StatusCodes.NOT_FOUND,"Comment with this id was not found")
    checkPermissions(req.user,searchedComment.user);
    
    if(!changedValue) throw new Error(StatusCodes.BAD_REQUEST,"Missing values to update the comment");
    


    searchedComment.value = changedValue || searchedComment.value;
    await searchedComment.validate();
    await searchedComment.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        comment: searchedComment
    });
}

async function deleteComment(req,res) {
    const { id:commentId } = req.params

    const searchedComment = await Comment.findById({_id:commentId});
    if(!searchedComment) throw new Error(StatusCodes.NOT_FOUND,"Comment with this id was not found")
    checkPermissions(req.user,searchedComment.user);
    
    const deletedComment = await Comment.findOneAndDelete({_id:commentId})

    res.status(StatusCodes.OK).json({
        msg: "OK",
        comment: deletedComment
    });
}

module.exports = {
    getAllComments,
    getSingleComment,
    createComment,
    addOrRemoveLikeToComment,
    updateComment,
    deleteComment
}
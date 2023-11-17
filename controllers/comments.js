const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/Comment");
const { Error, checkPermissions } = require("../utils");

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
    updateComment,
    deleteComment
}
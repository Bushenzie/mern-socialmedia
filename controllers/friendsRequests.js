const { Error, checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");

//TODO - GetUsersFriendRequsts -> return all directed to him and all he sent!

async function getAllFriendRequests(req,res) {

    const requests = await FriendRequest.find({});

    if(!requests) throw new Error(StatusCodes.NOT_FOUND,"No friend requests found")

    res.status(StatusCodes.OK).json({
        msg: "OK",
        count: requests.length,
        requests
    })
}

async function getUsersFriendRequests(req,res) {
    const {userId} = req.body;

    const friendRequests = await FriendRequest.find({to:userId});
    if(!friendRequests) throw new Error(StatusCodes.NOT_FOUND,"No friend requests found");

    res.status(StatusCodes.OK).json({
        msg: "OK",
        requests: friendRequests,
        count: friendRequests.length
    })

}

async function sendFriendRequest(req,res) {
    const { userId:senderId } = req.user;
    const { id:receiverId } = req.params;

    const senderUser = await User.findById({_id:senderId});
    const receiverUser = await User.findById({_id:receiverId});

    if(!senderUser || !receiverUser) throw new Error(StatusCodes.BAD_REQUEST,"Invalid user IDs");

    const friendRequest = await FriendRequest.create({
        from: senderUser._id,
        to: receiverUser._id,
    })

    res.status(StatusCodes.OK).json({
        msg: "OK",
        request: friendRequest
    })
}


async function acceptFriendRequest(req,res) {
    const currentUser = req.user;
    const { id:friendReqId } = req.params;

    const searchedRequest = await FriendRequest.findById({_id: friendReqId});
    if(!searchedRequest) throw new Error(StatusCodes.NOT_FOUND,"No friend request with this id found")

    const {from:sender,to:receiver} = searchedRequest;
    checkPermissions(currentUser,receiver)

    const senderUser = await User.findById({_id:sender});
    const receiverUser = await User.findById({_id:receiver});
    await senderUser.addFriend(receiverUser._id)
    await receiverUser.addFriend(senderUser._id)

    
    // searchedRequest.status = "accepted";
    // await searchedRequest.validate();
    // await searchedRequest.save();
    
    await FriendRequest.findByIdAndDelete({_id: searchedRequest._id})

    res.status(StatusCodes.OK).json({
        msg: "OK",
        sender: senderUser,
        receiver: receiverUser
    })
}

async function declineFriendRequest(req,res) {
    const currentUser = req.user;
    const { id:friendReqId } = req.params;

    const searchedRequest = await FriendRequest.findById({_id: friendReqId});
    if(!searchedRequest) throw new Error(StatusCodes.NOT_FOUND,"No friend request with this id found")

    const {from:sender,to:receiver} = searchedRequest;
    checkPermissions(currentUser,receiver)

    const senderUser = await User.findById({_id:sender});
    const receiverUser = await User.findById({_id:receiver});
    await senderUser.removeFriend(receiverUser._id)
    await receiverUser.removeFriend(senderUser._id)

    // searchedRequest.status = "declined";
    // await searchedRequest.validate();
    // await searchedRequest.save();

    await FriendRequest.findByIdAndDelete({_id: searchedRequest._id})

    res.status(StatusCodes.OK).json({
        msg: "OK",
        sender: senderUser,
        receiver: receiverUser
    })
}   

async function deleteFriendRequest(req,res) {
    const currentUser = req.user;
    const { id:friendReqId } = req.params;

    const searchedRequest = await FriendRequest.findById({_id: friendReqId});
    if(!searchedRequest) throw new Error(StatusCodes.NOT_FOUND,"No friend request with this id found")

    const {from:sender,to:receiver} = searchedRequest;
    checkPermissions(currentUser,receiver);

    const deletedRequest = await FriendRequest.findByIdAndDelete({_id:friendReqId});


    res.status(StatusCodes.OK).json({
        msg: "OK",
        request: deletedRequest
    })
}

module.exports= {
    getAllFriendRequests,
    getUsersFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    deleteFriendRequest
}


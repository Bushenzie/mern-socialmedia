const { Error, checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { User, FriendRequest } = require("../models");

//TODO - refactor + better accept/decline handling
//TODO - fully test it

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

    const request = await FriendRequest.findById({_id: friendReqId});
    if(!request) throw new Error(StatusCodes.NOT_FOUND,"No friend request with this id found")
    if(request.status !== "pending") throw new Error(StatusCodes.BAD_REQUEST,"Request is not active")

    const sender = await User.findById({_id: request.from});
    const receiver = await User.findById({_id: request.to});
    if(!sender || !receiver) throw new Error(StatusCodes.NOT_FOUND,"Invalid sender or receiver");
    checkPermissions(currentUser,receiver)

    //if(sender.friends.includes(receiver._id) || receiver.friends.includes(sender._id)) throw new Error(StatusCodes.BAD_REQUEST,"Users already friends");
    let updatedSender = await User.findOneAndUpdate({_id:sender._id},{ friends: [...sender.friends,receiver._id]},{new:true})
    let updatedReceiver = await User.findOneAndUpdate({_id:receiver._id},{ friends: [...receiver.friends,sender._id]},{new:true})
    request.status = "accepted";
    await request.validate();
    await request.save();
    //await FriendRequest.findByIdAndDelete({_id: request._id})

    res.status(StatusCodes.OK).json({
        msg: "OK",
        sender: updatedSender,
        receiver: updatedReceiver,
        request
    })
}

async function declineFriendRequest(req,res) {
    const currentUser = req.user;
    const { id:friendReqId } = req.params;

    const request = await FriendRequest.findById({_id: friendReqId});
    if(!request) throw new Error(StatusCodes.NOT_FOUND,"No friend request with this id found")

    const {from:sender,to:receiver} = request;
    checkPermissions(currentUser,receiver)

    if(request.status !== "pending") throw new Error(StatusCodes.BAD_REQUEST,"Request is not active")
    request.status = "declined";
    await request.validate();
    await request.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        request
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


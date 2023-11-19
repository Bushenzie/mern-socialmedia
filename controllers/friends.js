const { Error, checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models");

//Friends Controllers
async function getFriends(req,res) {
    const {userId} = req.user;

    const searchedUser = await User.findById({_id: userId}).populate("friends");
    //if(!searchedUser) throw new Error(StatusCodes.NOT_FOUND,"User not found");

    res.status(StatusCodes.OK).json({
        msg: "OK",
        friends: searchedUser.friends,
        count: searchedUser.friends.length
    })
}

async function removeFriend(req,res) {
    const {userId} = req.user;
    const {id:friendId} = req.params;
    
    const currentUser = await User.findById({_id: userId});
    const friendUser = await User.findById({_id:friendId});

    if(!friendUser) throw new Error(StatusCodes.NOT_FOUND,"Friend to remove was not found")

    const usersFilteredFriends = currentUser.friends.filter(friend => friend.toString() !== friendId);
    const friendsFilteredFriends = friendUser.friends.filter(friend => friend.toString() !== userId);

    currentUser.friends = usersFilteredFriends;
    friendUser.friends = friendsFilteredFriends;

    await currentUser.validate();
    await friendUser.validate();

    await currentUser.save();
    await friendUser.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        currentUser,
        friendUser
    })
}


module.exports= {
    getFriends,
    removeFriend
}


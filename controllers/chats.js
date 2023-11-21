const Chat = require("../models/Chat");
const User = require("../models/User");
const { Error } = require("../utils");
const { StatusCodes } = require("http-status-codes");

async function getAllChats(req,res) {
    const chats = await Chat.find({});
    if(!chats) throw new Error(StatusCodes.NOT_FOUND,"No chats found");

    res.status(StatusCodes.OK).json({
        msg: "OK",
        count: chats.length,
        chats
    })
}

async function getSingleChat(req,res) {
    const {id:chatId} = req.params;

    const searchedChat = await Chat.findById({_id:chatId}).populate("users");

    if(!searchedChat) throw new Error(StatusCodes.NOT_FOUND,"Chat not found");

    res.status(StatusCodes.OK).json({
        msg: "OK",
        chat: searchedChat
    })

}

async function createChat(req,res) {
    const { users } = req.body;
    users.sort();

    if(!users || users.length < 2) throw new Error(StatusCodes.BAD_REQUEST,"No or less than 2 chat users.")

    const alreadyExistingChats = await Chat.find({users})
    if(alreadyExistingChats.length > 0) throw new Error(StatusCodes.BAD_REQUEST,"Chat already exists")

    //should refactor
    for(let i = 0; i < users.length; i++) {
        let userFromDB = await User.findById({_id: users[i]});
        if(!userFromDB) throw new Error(StatusCodes.NOT_FOUND,"Could not find user in DB")
    }

    const createdChat = await Chat.create({
        users
    })

    res.status(StatusCodes.OK).json({
        msg: "OK",
        chat: createdChat
    })
}


module.exports = {
    getAllChats,
    getSingleChat,
    createChat
}
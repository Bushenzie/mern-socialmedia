const Chat = require("../models/Chat")

async function getAllChats(req,res) {
    res.send("get all chats")
}

async function getSingleChat(req,res) {
    res.send("get single chats")
}

async function createChat(req,res) {
    res.send("get single chats")
}


module.exports = {
    getAllChats,
    getSingleChat,
    createChat
}
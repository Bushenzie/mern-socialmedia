const Message = require("../models/Message");
const { Error } = require("../utils");
const { StatusCodes } = require("http-status-codes");

//TODO - Queries to get only few msg at a time

async function getChatMessages(req,res) {
    const {id:chatId} = req.params;
    
    const searchedMessages = await Message.find({chat:chatId});
    if(!searchedMessages) throw new Error(StatusCodes.NOT_FOUND,"Messages not found")

    res.status(StatusCodes.OK).json({
        msg: "OK",
        messages: searchedMessages,
        count: searchedMessages.length
    })
}

async function createMessage(req,res) {
    const { chatId,message } = req.body;
    const { userId } = req.user;

    if(!chatId || !message) throw new Error(StatusCodes.BAD_REQUEST,"Missing required fields");

    const createdMessage = await Message.create({
        chat: chatId,
        sender: userId,
        value: message
    })

    res.status(StatusCodes.OK).json({
        msg: "OK",
        message: createdMessage
    })
}

async function updateMessage(req,res) {
    const { id:messageId } = req.params;
    const { message } = req.body;

    if(!message) throw new Error(StatusCodes.BAD_REQUEST,"Missing fields to update");

    const searchedMessage = await Message.findById({_id: messageId});
    if(!searchedMessage) throw new Error(StatusCodes.NOT_FOUND,"Message to update was not found");

    searchedMessage.value = message;
    searchedMessage.edited = true;
    await searchedMessage.validate();
    await searchedMessage.save();

    res.status(StatusCodes.OK).json({
        msg: "OK",
        message: searchedMessage
    })
}

async function deleteMessages(req,res) {
    const {id:messageId} = req.params;

    const searchedMessage = await Message.findById({_id: messageId});
    if(!searchedMessage) throw new Error(StatusCodes.NOT_FOUND,"Message to delete was not found");

    const deletedMessage = await Message.findByIdAndDelete({_id: messageId});

    res.status(StatusCodes.OK).json({
        msg: "OK",
        message: deletedMessage
    })
}


module.exports = {
    getChatMessages,
    createMessage,
    updateMessage,
    deleteMessages
}
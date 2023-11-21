
async function getChatMessages(req,res) {
    res.send("get chat msgs")
}

async function createMessage(req,res) {
    res.send("create single msgs")
}

async function updateMessage(req,res) {
    res.send("update single msgs")
}

async function deleteMessages(req,res) {
    res.send("delete single msgs")
}


module.exports = {
    getChatMessages,
    createMessage,
    updateMessage,
    deleteMessages
}
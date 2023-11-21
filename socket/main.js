const { Server } = require("socket.io");
const io = new Server({cors: "http://localhost:3000"})

module.exports = io;
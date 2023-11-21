const io = require("./main");

io.on("connection",(socket) => {
    console.log(socket.id)
})
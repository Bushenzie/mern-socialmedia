require("dotenv").config();
require("express-async-errors");
//Packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

//Variables
const app = express();
const PORT = process.env.PORT || 3000;
const io = require("socket.io")

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(fileUpload({
    limits: { fileSize: 30 * 1024 * 1024 }
}))
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials:true, 
        optionsSuccessStatus:200
    }
));

//Routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const friendsRouter = require("./routes/friends");
const friendsRequestsRouter = require("./routes/friendsRequests")
const uploadsRouter = require("./routes/uploads");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const chatsRouter = require("./routes/chats");
const messagesRouter = require("./routes/messages");
app.use("/auth",authRouter)
app.use("/users",usersRouter)
app.use("/friends",friendsRouter)
app.use("/friends/requests",friendsRequestsRouter)
app.use("/uploads",uploadsRouter)
app.use("/posts",postsRouter)
app.use("/comments",commentsRouter)
app.use("/chats",chatsRouter)
app.use("/messages",messagesRouter)

//Custom middlewares
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found-handler");
app.use(errorHandler);
app.use(notFound);

startServer();
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB.");
        app.listen(PORT,() => {
            console.log(`Started the server on port ${PORT}.`);
        })
    } catch(err) {
        throw new Error("Could not start the server");
    }
} 

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
app.use(cors());

//Routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const uploadsRouter = require("./routes/uploads");
const postsRouter = require("./routes/posts");
app.use("/auth",authRouter)
app.use("/users",usersRouter)
app.use("/uploads",uploadsRouter)
app.use("/posts",postsRouter)

//Custom middlewares
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found-handler");
app.use(errorHandler);
app.use(notFound);


start();
async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        app.listen(PORT,() => {
            console.log(`Successfully started the server on port ${PORT}.`);
        })
    } catch(err) {
        throw new Error("Could not start the server");
    }
} 

const express = require("express");
const router = express.Router();
const {getAllChats,getSingleChat,createChat} = require("../controllers/chats");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");

router.get("/",authentication,getAllChats);
router.get("/:id",authentication,getSingleChat);
router.post("/",authentication,createChat);

module.exports = router;
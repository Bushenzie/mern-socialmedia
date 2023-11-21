const express = require("express");
const router = express.Router();
const {
    getChatMessages,
    createMessage,
    updateMessage,
    deleteMessages
} = require("../controllers/messages");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");

router.get("/:id",authentication,getChatMessages);
router.post("/",authentication,createMessage);
router.patch("/:id",authentication,updateMessage);
router.delete("/:id",authentication,deleteMessages);


module.exports = router;
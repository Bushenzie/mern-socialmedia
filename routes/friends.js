const express = require("express");
const router = express.Router();
const {
    getFriends,
    removeFriend
} = require("../controllers/friends");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");

//Friends Routes/Controllers
router.get("/",authentication,getFriends);
router.delete("/:id",authentication,removeFriend);


module.exports = router;
const express = require("express");
const router = express.Router();
const {
    getAllFriendRequests,
    getUsersFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    deleteFriendRequest
} = require("../controllers/friendsRequests");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");


//Only Admins for debug
router.get("/all",authentication, authorizeRoles("admin"), getAllFriendRequests);

//For Users
router.get("/",authentication, getUsersFriendRequests);
router.post("/:id",authentication, sendFriendRequest);
router.patch("/:id/accept",authentication, acceptFriendRequest);
router.patch("/:id/decline",authentication, declineFriendRequest);
router.delete("/:id",authentication, deleteFriendRequest);

module.exports = router;
const express = require("express");
const router = express.Router();
const {getAllComments,getSingleComment,createComment,updateComment,deleteComment} = require("../controllers/comments");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");

router.get("/",authentication,authorizeRoles("admin"), getAllComments)
router.get("/:id",authentication, getSingleComment)
router.post("/",authentication, createComment)
router.patch("/:id",authentication, updateComment)
router.delete("/:id",authentication, deleteComment)


module.exports = router;



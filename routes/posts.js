const express = require("express");
const router = express.Router();
const {
    getAllPosts,
    getSinglePost,
    createPost,
    addOrRemoveLikeToPost,
    updatePost,
    deletePost
} = require("../controllers/posts");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");

router.get("/",authentication, getAllPosts)
router.get("/:id",authentication, getSinglePost)
router.post("/",authentication, createPost)
router.patch("/:id/like",authentication, addOrRemoveLikeToPost)
router.patch("/:id",authentication, updatePost)
router.delete("/:id",authentication, deletePost)


module.exports = router;



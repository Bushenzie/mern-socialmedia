const express = require("express");
const router = express.Router();
const {getAllPosts} = require("../controllers/posts");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");

router.get("/",authentication,authorizeRoles("admin"),getAllPosts)


module.exports = router;



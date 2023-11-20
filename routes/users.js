const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getCurrentUser,
    getSingleUser,
    updateUser,
    deleteUser
} = require("../controllers/users");
const authentication = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorization");

router.get("/",authentication,authorizeRoles("admin"),getAllUsers);
router.get("/current",authentication,getCurrentUser);
router.get("/:id",authentication,getSingleUser);
router.patch("/:id",authentication,updateUser);
router.delete("/:id",authentication,deleteUser);

module.exports = router;
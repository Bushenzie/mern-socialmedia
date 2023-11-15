const express = require("express");
const router = express.Router();
const {register,login,logout, verifyEmail} = require("../controllers/auth");
const authentication = require("../middleware/authentication");

router.post("/register",register);
router.post("/login",login);
router.get("/logout",authentication,logout);
router.get("/verifyEmail",verifyEmail);

module.exports = router;
const express = require("express");
const router = express.Router();
const {uploadImage} = require("../controllers/uploads")

router.post("/image",uploadImage);

module.exports = router;
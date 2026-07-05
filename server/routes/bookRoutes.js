const express = require("express");
const router = express.Router();
const bookController = require("../controller/bookController");
const upload = require("../middleware/upload");
const authorize = require("../middleware/authorize");
const protect = require("../middleware/protect");

router.post("/books/upload", protect, authorize("admin"), upload.single("image"), bookController.BookUpload);


module.exports = router;   
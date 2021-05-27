const express = require("express");
const router = express.Router();

var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const { getAll, create, getById } = require("../controllers/imageController");

// route to respond to img tags
router.get("/:key", getById);
// upload to server with middleware, then upload to s3
router.post("/", upload.single("image"), create);
// get images list
router.get("/", getAll);

module.exports = router;

const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const {
  getAll,
  getById,
  getImageByKey,
  create,
  update,
  deleteById,
} = require("../controllers/obrasController");

router.get("/", getAll);
router.get("/:id", getById);
router.get("/images/:key", getImageByKey);
router.post(
  "/",
  upload.fields([{ name: "images" }, { name: "cover", maxCount: 1 }]),
  create
);
router.delete("/:id", deleteById);

module.exports = router;

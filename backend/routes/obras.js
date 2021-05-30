const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const {
  getAll,
  getById,
  create,
  update,
  deleteById,
} = require("../controllers/obrasController");

router.post(
  "/",
  upload.fields([{ name: "images" }, { name: "cover", maxCount: 1 }]),
  create
);

router.delete("/:id", deleteById);

module.exports = router;

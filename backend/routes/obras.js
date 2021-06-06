const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const { getAll, getById, getImageByKey, create, update, deleteImageByKey, deleteById } = require("../controllers/obrasController");

router.get("/", getAll);
router.get("/:id", getById);
router.get("/images/:key", getImageByKey);
router.post("/", upload.fields([{ name: "images" }, { name: "cover", maxCount: 1 }]), create);
router.delete("/images/:key", deleteImageByKey);
router.delete("/:id", deleteById);
router.put("/:id", upload.fields([{ name: "images" }, { name: "cover", maxCount: 1 }]), update);

module.exports = router;

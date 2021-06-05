const obraModel = require("../models/obraModel");
const { uploadFile, getFileStream, deleteFile } = require("../utils/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

module.exports = {
  getAll: async function (req, res, next) {
    try {
      const obras = await obraModel.find();
      res.status(200).json(obras);
    } catch (e) {
      e.status = 400;
      console.log(e.message);
    }
  },
  getById: async function (req, res, next) {
    try {
      const obra = await obraModel.findById(req.params.id);
      res.status(200).json(obra);
    } catch (e) {
      e.status = 400;
      console.log(e.message);
      res.status(400).send(e);
    }
  },
  getImageByKey: (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
  },
  create: async function (req, res, next) {
    const cover = req.files["cover"][0];
    const images = req.files["images"];
    let coverArrayForMongo = [];
    let imagesArrayForMongo = [];
    if (cover) {
      coverArrayForMongo = [
        {
          path: cover.filename,
          originalName: cover.originalname,
        },
      ];
    }
    if (images) {
      for (let image of images) {
        const imageForMongo = {
          path: image.filename,
          originalName: image.originalname,
        };
        imagesArrayForMongo.push(imageForMongo);
      }
    }

    let newObraId = ""; // For storing id to delete if something goes wrong in s3 upload

    const document = new obraModel({
      title: req.body.title,
      subtitle: req.body.subtitle,
      year: req.body.year,
      text: req.body.text,
      cover: coverArrayForMongo,
      images: imagesArrayForMongo,
    });

    try {
      const newObra = await document.save();

      newObraId = newObra._id;

      //upload images to s3, then erase from server
      if (cover) {
        await uploadFile(cover);
        await unlinkFile(cover.path);
      }
      if (images) {
        for (let image of images) {
          await uploadFile(image);
          await unlinkFile(image.path);
        }
      }

      res.status(200).json(newObra);
    } catch (e) {
      try {
        // erase document
        await obraModel.deleteOne({ _id: newObraId });
        // erase uploaded files
        if (images) {
          for (image of images) {
            await deleteFile(image.filename);
          }
        }
        if (cover) {
          await deleteFile(cover.filename);
        }
      } catch (e) {
        console.log(e);
      }
      e.status = 400;
      res.send(e);
      console.log(e.message + " (Error en image/ post create)");
    }
  },
  update: async function (req, res, next) {
    const cover = req.files["cover"] ? req.files["cover"][0] : null;
    const images = req.files["images"];
    const id = req.params.id;
    try {
      let obra = await obraModel.findById({ _id: id });

      if (cover) {
        const coverForMongo = {
          path: cover.filename,
          originalName: cover.originalname,
        };
        obra.cover.push(coverForMongo);
      }
      if (images) {
        for (let image of images) {
          const imageForMongo = {
            path: image.filename,
            originalName: image.originalname,
          };
          obra.images.push(imageForMongo);
        }
      }

      obra.title = req.body.title;
      obra.subtitle = req.body.subtitle;
      obra.year = req.body.year;
      obra.text = req.body.text;

      const response = await obraModel.updateOne({ _id: req.params.id }, obra);
      console.log(response);
      if (cover) {
        await uploadFile(cover);
        await unlinkFile(cover.path);
      }
      if (images) {
        for (let image of images) {
          await uploadFile(image);
          await unlinkFile(image.path);
        }
      }
      let updatedObra = await obraModel.findById({ _id: id });
      res.status(200).json(updatedObra);
    } catch (e) {
      e.status = 400;
      next(e);
    }
  },
  deleteImageByKey: async function (req, res, next) {
    const key = req.params.key;
    const section = req.query.section;
    const modelId = req.query.modelId;
    const imageId = req.query.imageId;
    const coverFlag = req.query.coverFlag;
    let record = {};
    let recordModified = {};
    try {
      if (section === "obras") {
        record = await obraModel.findById({ _id: modelId });
      }
      if (coverFlag === "true") {
        await record.cover.id(imageId).remove();
      } else {
        await record.images.id(imageId).remove();
      }
      await deleteFile(key);
      recordModified = await record.save();
      res.status(200).json(recordModified);
    } catch (e) {
      console.log(e);
      e.status = 400;
      res.json(e);
    }
  },
};

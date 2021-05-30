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
  getById: (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
  },
  create: async function (req, res, next) {
    const cover = req.files["cover"][0];
    const images = req.files["images"];
    let coverArrayForMongo = [
      {
        s3name: cover.filename,
        originalName: cover.originalname,
      },
    ];
    let imagesArrayForMongo = [];
    for (let image of images) {
      const imageForMongo = {
        s3name: image.filename,
        originalName: image.originalname,
      };
      imagesArrayForMongo.push(imageForMongo);
    }

    let newObraId = "";

    try {
      // save new obra in Mongo
      const document = new obraModel({
        title: req.body.title,
        subtitle: req.body.subtitle,
        year: req.body.year,
        text: req.body.text,
        cover: coverArrayForMongo,
        images: imagesArrayForMongo,
      });

      const newObra = await document.save();

      newObraId = newObra._id;

      //upload images to s3, then erase from server
      await uploadFile(cover);
      await unlinkFile(cover.path);

      for (let image of images) {
        await uploadFile(image);
        await unlinkFile(image.path);
      }

      res.status(200).json(newObra);
    } catch (e) {
      try {
        // erase document
        await obraModel.deleteOne({ _id: newObraId });
        // erase uploaded files
        for (image of images) {
          await deleteFile(image.filename);
        }
        await deleteFile(cover.filename);
      } catch (e) {
        console.log(e);
      }
      e.status = 400;
      res.send(e);
      console.log(e.message + " (Error en image/ post create)");
    }
  },
  update: function () {},
  deleteById: async function (req, res, next) {
    const id = req.params.id;
    try {
      await deleteFile(id);
      res.status(200).json("succesfully deleted");
    } catch (e) {
      e.status = 400;
      res.json(e);
    }
  },
};
